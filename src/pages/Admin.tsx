import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, 
  Briefcase, 
  Image as ImageIcon, 
  Mail, 
  Palette,
  Save,
  Plus,
  Trash2,
  Users,
  LogOut,
  ChevronRight,
  Code,
  User as UserIcon
} from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { useTheme } from '../store/useTheme';
import { useContent } from '../store/useContent';
import { 
  doc, 
  updateDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const { themeSet, mode } = useTheme();
  const { hero, about, experience, projects, gallery, contact } = useContent();
  const [messages, setMessages] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'admins'), (s) => {
      setAdmins(s.docs.map(d => ({ id: d.id, email: d.id })));
    });
    return () => unsub();
  }, []);

  const handleUpdateGlobal = async (collName: string, docId: string, data: any) => {
    try {
      await setDoc(doc(db, collName, docId), data, { merge: true });
    } catch (err) {
      console.error(err);
      alert('Error updating database');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile & Hero', icon: <UserIcon size={18} /> },
    { id: 'settings', label: 'Theme & Style', icon: <Palette size={18} /> },
    { id: 'experience', label: 'Work Experience', icon: <Briefcase size={18} /> },
    { id: 'projects', label: 'Projects', icon: <ImageIcon size={18} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Code size={18} /> },
    { id: 'contact', label: 'Contact Info', icon: <Mail size={18} /> },
    { id: 'messages', label: 'Inquiries', icon: <Mail size={18} />, count: messages.length },
    { id: 'admins', label: 'Admin Access', icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 bg-card border-r border-border p-6 flex flex-col gap-8 overflow-y-auto max-h-[calc(100vh-80px)] lg:sticky lg:top-20">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-black rounded-lg text-lg">NK</div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-tighter">Admin Panel</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">v2.0 Simple Edition</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ${activeTab === item.id ? 'bg-white text-primary' : 'bg-destructive text-white'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border space-y-2">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-sm font-bold text-muted-foreground transition-all"
          >
            <Layout size={18} /> View Site
          </button>
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive text-sm font-bold transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl"
          >
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter capitalize">{activeTab.replace('-', ' ')}</h1>
              <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-2">Manage your {activeTab} information</p>
            </header>

            <div className="space-y-12">
              {activeTab === 'settings' && (
                <section className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <label className="text-xs uppercase font-black tracking-widest opacity-50 block">Choose Theme Set</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['architectural', 'concrete', 'luxury', 'nordic', 'precision', 'blueprint'].map((t) => (
                          <button
                            key={t}
                            onClick={() => handleUpdateGlobal('settings', 'global', { themeSet: t as any })}
                            className={`px-4 py-5 rounded-2xl border-2 text-xs font-black capitalize transition-all ${themeSet === t ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary/30 border-transparent bg-card'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <label className="text-xs uppercase font-black tracking-widest opacity-50 block">Visual Mode</label>
                      <div className="flex flex-col gap-3">
                        {['light', 'dark', 'brown'].map((m) => (
                          <button
                            key={m}
                            onClick={() => handleUpdateGlobal('settings', 'global', { mode: m as any })}
                            className={`px-6 py-5 rounded-2xl border-2 text-xs font-black capitalize flex items-center justify-between transition-all ${mode === m ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary/30 border-transparent bg-card'}`}
                          >
                            {m} Mode
                            {mode === m && <ChevronRight size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeTab === 'profile' && (
                <ProfileEditor hero={hero} about={about} onUpdate={async (heroData: any, aboutData: any) => {
                  await handleUpdateGlobal('content', 'hero', heroData);
                  await handleUpdateGlobal('content', 'about', aboutData);
                }} />
              )}

              {activeTab === 'experience' && (
                <ListEditor 
                  title="Experience" 
                  collectionName="experience" 
                  items={experience} 
                  fields={[
                    { key: 'role', label: 'Role/Position', type: 'text' },
                    { key: 'company', label: 'Company/Institution', type: 'text' },
                    { key: 'period', label: 'Period (e.g., 2024 - Present)', type: 'text' },
                    { key: 'description', label: 'Description', type: 'textarea' },
                    { key: 'order', label: 'Sort Order (number)', type: 'number' }
                  ]}
                />
              )}

              {activeTab === 'projects' && (
                <ListEditor 
                  title="Projects" 
                  collectionName="projects" 
                  items={projects} 
                  fields={[
                    { key: 'title', label: 'Project Name', type: 'text' },
                    { key: 'category', label: 'Category', type: 'text' },
                    { key: 'description', label: 'Summary', type: 'textarea' },
                    { key: 'image', label: 'Image URL', type: 'text' },
                    { key: 'link', label: 'External Link', type: 'text' },
                    { key: 'order', label: 'Sort Order (number)', type: 'number' }
                  ]}
                />
              )}

              {activeTab === 'gallery' && (
                <ListEditor 
                  title="Gallery" 
                  collectionName="gallery" 
                  items={gallery} 
                  fields={[
                    { key: 'title', label: 'Image Title', type: 'text' },
                    { key: 'url', label: 'Image URL', type: 'text' },
                    { key: 'order', label: 'Sort Order (number)', type: 'number' }
                  ]}
                />
              )}

              {activeTab === 'skills' && (
                <SkillsEditor 
                  about={about} 
                  onUpdate={(skills: string[]) => handleUpdateGlobal('content', 'about', { skills })} 
                />
              )}

              {activeTab === 'contact' && (
                <ContactEditor 
                  data={contact} 
                  onUpdate={(d: any) => handleUpdateGlobal('content', 'contact', d)} 
                />
              )}

              {activeTab === 'messages' && (
                <div className="grid gap-6">
                  {messages.map((m) => (
                    <div key={m.id} className="p-10 rounded-[2.5rem] bg-card border border-border group relative hover:border-primary/20 transition-all">
                      <button 
                        onClick={() => deleteDoc(doc(db, 'messages', m.id))}
                        className="absolute top-10 right-10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={24} />
                      </button>
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                        <h4 className="text-2xl font-black tracking-tight">{m.name}</h4>
                        <span className="text-xs font-black bg-primary/10 text-primary px-4 py-1.5 rounded-full tracking-wider">{m.email}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest ml-auto">{m.createdAt?.seconds ? new Date(m.createdAt.seconds * 1000).toLocaleString() : 'Just now'}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center py-32 bg-card rounded-[3rem] border-4 border-dashed border-border/50">
                      <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-6 opacity-20" />
                      <p className="text-muted-foreground font-black uppercase tracking-widest">No inquiries at the moment</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'admins' && (
                <div className="p-10 rounded-[2.5rem] bg-card border border-border space-y-10">
                  <div className="space-y-4">
                    <label className="text-xs uppercase font-black tracking-widest opacity-50 block">Grant New Access</label>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                      if (email) {
                        await setDoc(doc(db, 'admins', email), { addedAt: new Date() });
                        e.currentTarget.reset();
                      }
                    }} className="flex gap-3">
                      <input name="email" type="email" placeholder="Enter administrator email..." className="flex-1 bg-background border border-border rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-primary outline-none text-lg" required />
                      <button type="submit" className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all">
                        <Plus size={20} /> Grant
                      </button>
                    </form>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs uppercase font-black tracking-widest opacity-50 block">Current Administrators</label>
                    <div className="grid gap-3">
                      {admins.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-6 rounded-2xl bg-background/50 border border-border hover:border-primary/20 transition-all group">
                          <span className="font-bold text-lg">{a.email}</span>
                          <button 
                            onClick={() => deleteDoc(doc(db, 'admins', a.id))}
                            className="text-muted-foreground hover:text-destructive p-3 rounded-xl hover:bg-destructive/10 transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function ProfileEditor({ hero, about, onUpdate }: any) {
  const [name, setName] = useState(hero?.title || '');
  const [subtitle, setSubtitle] = useState(hero?.subtitle || '');
  const [badge, setBadge] = useState(hero?.badge || '');
  const [pic, setPic] = useState(about?.image || '');
  const [bio, setBio] = useState(about?.bio || '');
  const [education, setEducation] = useState(about?.education || '');

  useEffect(() => {
    if (hero) {
      setName(hero.title || '');
      setSubtitle(hero.subtitle || '');
      setBadge(hero.badge || '');
    }
    if (about) {
      setPic(about.image || '');
      setBio(about.bio || '');
      setEducation(about.education || '');
    }
  }, [hero, about]);

  return (
    <div className="p-8 rounded-3xl bg-card border border-border space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">Display Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <div>
          <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">Job Title / Subtitle</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">Availability Status (Badge)</label>
          <input value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Available for Projects" />
        </div>
        <div>
          <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">Education Status</label>
          <input value={education} onChange={(e) => setEducation(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" />
        </div>
      </div>

      <div>
        <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">Profile Picture URL</label>
        <input value={pic} onChange={(e) => setPic(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" />
      </div>

      <div>
        <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">Professional Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none min-h-[150px]" />
      </div>

      <button 
        onClick={() => onUpdate({ ...hero, title: name, subtitle, badge }, { ...about, image: pic, bio, education })}
        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <Save size={18} /> Update Profile & Hero
      </button>

      <div className="pt-4 border-t border-border mt-4">
        <button 
          onClick={() => {
            setName("Nayan Kuikel");
            setEducation("Masters in Engineering (KU)");
            setPic("https://media.licdn.com/dms/image/v2/D5603AQEx58-yH78_1A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1723521251842?e=1743033600&v=beta&t=H3M888U8X8_K7y0yX9p3U_R5P9I-Q_6y7h0z9u0O7o4");
            setBio("Highly dedicated Civil Engineer with a passion for building sustainable and resilient infrastructure. Currently pursuing Masters in Engineering from Kathmandu University (KU). Experienced in site management, structural analysis, and team coordination as a Site Engineer at Vawan Bivag.");
          }}
          className="w-full bg-accent/20 text-accent-foreground py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-accent/30 transition-all"
        >
          Load LinkedIn Template Data
        </button>
      </div>
    </div>
  );
}

function ContactEditor({ data, onUpdate }: any) {
  const [email, setEmail] = useState(data?.email || '');
  const [phone, setPhone] = useState(data?.phone || '');
  const [linkedin, setLinkedin] = useState(data?.linkedin || '');

  useEffect(() => {
    if (data) {
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setLinkedin(data.linkedin || '');
    }
  }, [data]);

  return (
    <div className="p-8 rounded-3xl bg-card border border-border space-y-6">
      <div>
        <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">Public Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" />
      </div>
      <div>
        <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">Phone Number</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" />
      </div>
      <div>
        <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">LinkedIn Profile URL</label>
        <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" />
      </div>
      <button 
        onClick={() => onUpdate({ email, phone, linkedin })}
        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <Save size={18} /> Update Contact Info
      </button>
    </div>
  );
}

function SkillsEditor({ about, onUpdate }: any) {
  const [skillInput, setSkillInput] = useState('');
  const skills = about?.skills || [];

  const addSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      onUpdate([...skills, skillInput]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => {
    onUpdate(skills.filter((skill: string) => skill !== s));
  };

  return (
    <div className="space-y-8">
      <div className="p-8 rounded-3xl bg-card border border-border space-y-6">
        <div className="flex gap-4">
          <input 
            value={skillInput} 
            onChange={(e) => setSkillInput(e.target.value)} 
            placeholder="Add a skill (e.g. AutoCAD, ETABS)" 
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" 
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          />
          <button onClick={addSkill} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s: string) => (
            <span key={s} className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
              {s}
              <button onClick={() => removeSkill(s)} className="hover:text-destructive"><Trash2 size={14} /></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListEditor({ title, collectionName, items, fields }: any) {
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSave = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data: any = {};
    fields.forEach((f: any) => {
      data[f.key] = f.type === 'number' ? Number(formData.get(f.key)) : formData.get(f.key);
    });

    try {
      if (editingItem?.id) {
        await updateDoc(doc(db, collectionName, editingItem.id), data);
      } else {
        await addDoc(collection(db, collectionName), data);
      }
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      alert('Error saving entry');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tighter">{title} List</h2>
        <button 
          onClick={() => setEditingItem({})}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={18} /> Add New
        </button>
      </header>

      <div className="grid gap-4">
        {items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((item: any) => (
          <div key={item.id} className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between group">
            <div>
              <h4 className="font-bold text-lg">{item[fields[0].key]}</h4>
              <p className="text-sm text-muted-foreground">{item[fields[1].key]}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => setEditingItem(item)} className="p-2 rounded-lg hover:bg-accent">
                <Layout size={18} />
              </button>
              <button onClick={() => deleteDoc(doc(db, collectionName, item.id))} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-xl bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-black tracking-tighter mb-8">{editingItem.id ? 'Edit' : 'Add'} {title}</h2>
              <form onSubmit={handleSave} className="space-y-6">
                {fields.map((f: any) => (
                  <div key={f.key}>
                    <label className="text-[10px] uppercase font-black tracking-widest opacity-50 block mb-2">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea name={f.key} defaultValue={editingItem[f.key]} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none min-h-[120px]" required />
                    ) : (
                      <input name={f.key} type={f.type} defaultValue={editingItem[f.key]} className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-primary outline-none" required />
                    )}
                  </div>
                ))}
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                    Save
                  </button>
                  <button type="button" onClick={() => setEditingItem(null)} className="px-6 bg-accent text-accent-foreground rounded-xl font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
