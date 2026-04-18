import { useState, useEffect } from 'react';
import { db, auth, storage } from '../lib/firebase';
import { useTheme } from '../store/useTheme';
import { useContent } from '../store/useContent';
import {
  doc, collection, addDoc, deleteDoc, query,
  orderBy, onSnapshot, setDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, User, Briefcase, Palette,
  Mail, LogOut, ExternalLink, Plus, Trash2, Pencil, X, Check,
  Sun, Moon, Coffee, Image, MessageSquare, Shield, Loader2,
  ChevronRight, AlertCircle, CheckCircle
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'dashboard' | 'projects' | 'profile' | 'experience' | 'gallery' | 'theme' | 'messages' | 'users';

// ─── Sidebar Nav Item ──────────────────────────────────────────────────────────
function NavItem({ icon, label, tab, active, onClick }: { icon: React.ReactNode; label: string; tab: Tab; active: boolean; onClick: (t: Tab) => void }) {
  return (
    <button
      onClick={() => onClick(tab)}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
        active
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <ChevronRight size={14} className="ml-auto" />}
    </button>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl border ${
        type === 'success'
          ? 'bg-primary text-primary-foreground border-primary/20'
          : 'bg-destructive text-white border-destructive/20'
      }`}
    >
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X size={14} /></button>
    </motion.div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="glass p-8 rounded-[2rem] border border-transparent hover:border-primary/20 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          {icon}
        </div>
        <span className="text-4xl font-black tracking-tighter">{value}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

// ─── Main Admin Component ──────────────────────────────────────────────────────
export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { mode, setMode, themeSet, setThemeSet } = useTheme();
  const { hero, about, projects, experience } = useContent();
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();

  // Profile states
  const [profileName, setProfileName] = useState('');
  const [profileSubtitle, setProfileSubtitle] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');

  // Project states
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState('Engineering');
  const [projLink, setProjLink] = useState('#');
  const [projImageFile, setProjImageFile] = useState<File | null>(null);

  // Experience states
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Gallery
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [gallerySpan, setGallerySpan] = useState('col-span-1 row-span-1');
  const [uploading, setUploading] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });

  useEffect(() => {
    if (hero) { setProfileName(hero.title || ''); setProfileSubtitle(hero.subtitle || ''); }
    if (about) { setProfileBio(about.bio || ''); setProfileEmail(about.email || ''); setProfilePhone(about.phone || ''); }
  }, [hero, about]);

  useEffect(() => {
    const unsubs = [
      onSnapshot(query(collection(db, 'messages'), orderBy('createdAt', 'desc')), s =>
        setMessages(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(collection(db, 'users'), s =>
        setUsers(s.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'gallery'), orderBy('order', 'asc')), s =>
        setGallery(s.docs.map(d => ({ id: d.id, ...d.data() })))),
    ];
    return () => unsubs.forEach(u => u());
  }, []);

  // ── Upload helper ───────────────────────────────────────────────────────────
  const uploadImage = async (file: File, path: string): Promise<string> => {
    const r = ref(storage, path);
    await uploadBytes(r, file);
    return getDownloadURL(r);
  };

  // ── Projects CRUD ───────────────────────────────────────────────────────────
  const saveProject = async () => {
    if (!projTitle || !projDesc) return showToast('Fill all required fields', 'error');
    setUploading(true);
    try {
      let imageUrl = editingProject?.image || 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80';
      if (projImageFile) imageUrl = await uploadImage(projImageFile, `projects/${Date.now()}_${projImageFile.name}`);

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), { title: projTitle, description: projDesc, category: projCategory, link: projLink, image: imageUrl });
        showToast('Project updated!');
      } else {
        await addDoc(collection(db, 'projects'), { title: projTitle, description: projDesc, category: projCategory, link: projLink, image: imageUrl, order: projects.length, createdAt: serverTimestamp() });
        showToast('Project added!');
      }
      resetProjectForm();
    } catch { showToast('Error saving project', 'error'); }
    setUploading(false);
  };

  const resetProjectForm = () => { setEditingProject(null); setProjTitle(''); setProjDesc(''); setProjCategory('Engineering'); setProjLink('#'); setProjImageFile(null); };
  const startEditProject = (p: any) => { setEditingProject(p); setProjTitle(p.title); setProjDesc(p.description || ''); setProjCategory(p.category || 'Engineering'); setProjLink(p.link || '#'); setActiveTab('projects'); };
  const deleteProject = async (id: string) => { if (!confirm('Delete this project?')) return; await deleteDoc(doc(db, 'projects', id)); showToast('Project deleted'); };

  // ── Experience CRUD ─────────────────────────────────────────────────────────
  const saveExp = async () => {
    if (!expRole || !expCompany) return showToast('Fill all required fields', 'error');
    try {
      if (editingExp) {
        await updateDoc(doc(db, 'experience', editingExp.id), { role: expRole, company: expCompany, period: expPeriod, description: expDesc });
        showToast('Experience updated!');
      } else {
        await addDoc(collection(db, 'experience'), { role: expRole, company: expCompany, period: expPeriod, description: expDesc, order: experience.length });
        showToast('Experience added!');
      }
      resetExpForm();
    } catch { showToast('Error saving experience', 'error'); }
  };

  const resetExpForm = () => { setEditingExp(null); setExpRole(''); setExpCompany(''); setExpPeriod(''); setExpDesc(''); };
  const startEditExp = (e: any) => { setEditingExp(e); setExpRole(e.role); setExpCompany(e.company); setExpPeriod(e.period || ''); setExpDesc(e.description || ''); setActiveTab('experience'); };
  const deleteExp = async (id: string) => { if (!confirm('Delete?')) return; await deleteDoc(doc(db, 'experience', id)); showToast('Experience deleted'); };

  // ── Profile ─────────────────────────────────────────────────────────────────
  const updateProfile = async () => {
    try {
      await setDoc(doc(db, 'content', 'hero'), { title: profileName, subtitle: profileSubtitle }, { merge: true });
      await setDoc(doc(db, 'content', 'about'), { bio: profileBio, email: profileEmail, phone: profilePhone }, { merge: true });
      await setDoc(doc(db, 'content', 'contact'), { email: profileEmail, phone: profilePhone }, { merge: true });
      showToast('Profile updated!');
    } catch { showToast('Error updating profile', 'error'); }
  };

  // ── Gallery ─────────────────────────────────────────────────────────────────
  const addGalleryImage = async () => {
    if (!galleryImageFile) return showToast('Select an image first', 'error');
    setUploading(true);
    try {
      const url = await uploadImage(galleryImageFile, `gallery/${Date.now()}_${galleryImageFile.name}`);
      await addDoc(collection(db, 'gallery'), { url, span: gallerySpan, order: gallery.length });
      setGalleryImageFile(null);
      showToast('Image uploaded!');
    } catch { showToast('Upload failed', 'error'); }
    setUploading(false);
  };

  const deleteGalleryItem = async (id: string) => { await deleteDoc(doc(db, 'gallery', id)); showToast('Image removed'); };

  // ── Theme ───────────────────────────────────────────────────────────────────
  const toggleMode = async () => {
    const next = mode === 'light' ? 'dark' : mode === 'dark' ? 'brown' : 'light';
    setMode(next);
    await setDoc(doc(db, 'settings', 'global'), { mode: next }, { merge: true });
  };

  const setGlobalTheme = async (t: string) => {
    setThemeSet(t as any);
    await setDoc(doc(db, 'settings', 'global'), { themeSet: t }, { merge: true });
    showToast(`Theme set to ${t}`);
  };

  // ── Messages ────────────────────────────────────────────────────────────────
  const deleteMessage = async (id: string) => { await deleteDoc(doc(db, 'messages', id)); showToast('Message deleted'); };

  // ── Users ───────────────────────────────────────────────────────────────────
  const toggleUserRole = async (id: string, role: string) => {
    await updateDoc(doc(db, 'users', id), { role: role === 'admin' ? 'user' : 'admin' });
    showToast('Role updated');
  };

  const themes = ['architectural', 'concrete', 'luxury', 'nordic', 'precision', 'blueprint'];

  // ─── Input style helper ─────────────────────────────────────────────────────
  const inp = "w-full bg-background/50 border-2 border-border rounded-2xl px-5 py-3.5 font-bold focus:border-primary outline-none transition-all placeholder:text-muted-foreground/30 text-sm";
  const label = "block text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2";

  // ─── Section heading ────────────────────────────────────────────────────────
  const SectionHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div className="mb-10 pb-8 border-b border-border">
      <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">{title}<br /><span className="text-primary">{subtitle}</span></h2>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 glass border-r border-border flex flex-col p-6 gap-2 overflow-y-auto shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-4 mb-8 p-4">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-black text-lg">NK</div>
          <div>
            <p className="font-black tracking-tighter">Admin Panel</p>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Nayan Kuikel</p>
          </div>
        </div>

        <NavItem icon={<LayoutDashboard size={16} />} label="Dashboard" tab="dashboard" active={activeTab === 'dashboard'} onClick={setActiveTab} />
        <NavItem icon={<FolderKanban size={16} />} label="Projects" tab="projects" active={activeTab === 'projects'} onClick={setActiveTab} />
        <NavItem icon={<User size={16} />} label="Profile" tab="profile" active={activeTab === 'profile'} onClick={setActiveTab} />
        <NavItem icon={<Briefcase size={16} />} label="Experience" tab="experience" active={activeTab === 'experience'} onClick={setActiveTab} />
        <NavItem icon={<Image size={16} />} label="Gallery" tab="gallery" active={activeTab === 'gallery'} onClick={setActiveTab} />
        <NavItem icon={<Palette size={16} />} label="Theme" tab="theme" active={activeTab === 'theme'} onClick={setActiveTab} />
        <NavItem icon={<MessageSquare size={16} />} label={`Messages ${messages.length > 0 ? `(${messages.length})` : ''}`} tab="messages" active={activeTab === 'messages'} onClick={setActiveTab} />
        <NavItem icon={<Shield size={16} />} label="Users" tab="users" active={activeTab === 'users'} onClick={setActiveTab} />

        <div className="mt-auto pt-6 border-t border-border space-y-2">
          <Link to="/" className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
            <ExternalLink size={16} /> View Site
          </Link>
          <button
            onClick={() => { auth.signOut(); navigate('/login'); }}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >

            {/* ── DASHBOARD ── */}
            {activeTab === 'dashboard' && (
              <div>
                <SectionHeading title="Welcome" subtitle="Dashboard" />
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
                  <StatCard label="Projects" value={projects.length} icon={<FolderKanban size={20} />} />
                  <StatCard label="Experience" value={experience.length} icon={<Briefcase size={20} />} />
                  <StatCard label="Messages" value={messages.length} icon={<MessageSquare size={20} />} />
                  <StatCard label="Gallery" value={gallery.length} icon={<Image size={20} />} />
                </div>
                <div className="glass p-8 rounded-[2rem]">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Logged in as</p>
                  <p className="text-xl font-black">{auth.currentUser?.email}</p>
                </div>
              </div>
            )}

            {/* ── PROJECTS ── */}
            {activeTab === 'projects' && (
              <div>
                <SectionHeading title={editingProject ? 'Edit' : 'Add'} subtitle="Project" />
                <div className="grid xl:grid-cols-2 gap-8">
                  {/* Form */}
                  <div className="glass p-8 rounded-[2rem] space-y-5">
                    <div><label className={label}>Title *</label><input value={projTitle} onChange={e => setProjTitle(e.target.value)} placeholder="Project title" className={inp} /></div>
                    <div><label className={label}>Category</label>
                      <select value={projCategory} onChange={e => setProjCategory(e.target.value)} className={inp}>
                        {['Engineering', 'Design', 'Management', 'Research', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label className={label}>Description *</label><textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} placeholder="Project description" className={`${inp} min-h-[100px] resize-none`} /></div>
                    <div><label className={label}>Link</label><input value={projLink} onChange={e => setProjLink(e.target.value)} placeholder="https://..." className={inp} /></div>
                    <div>
                      <label className={label}>Image {editingProject ? '(leave empty to keep current)' : ''}</label>
                      <input type="file" accept="image/*" onChange={e => setProjImageFile(e.target.files?.[0] || null)} className={`${inp} cursor-pointer`} />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={saveProject} disabled={uploading} className="flex-1 group bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> {editingProject ? 'Update' : 'Save'}</>}
                      </button>
                      {editingProject && <button onClick={resetProjectForm} className="px-6 py-4 rounded-2xl border-2 border-border font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-all"><X size={16} /></button>}
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-4">
                    {projects.length === 0 && <div className="glass p-12 rounded-[2rem] text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">No projects yet</div>}
                    {projects.map((p: any) => (
                      <div key={p.id} className="glass p-6 rounded-2xl flex items-center gap-4 group hover:border-primary/20 border-2 border-transparent transition-all">
                        {p.image && <img src={p.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-black truncate">{p.title}</p>
                          <p className="text-[10px] uppercase tracking-widest text-primary font-black opacity-60">{p.category}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => startEditProject(p)} className="w-9 h-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"><Pencil size={14} /></button>
                          <button onClick={() => deleteProject(p.id)} className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all flex items-center justify-center"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeTab === 'profile' && (
              <div>
                <SectionHeading title="Edit" subtitle="Profile" />
                <div className="glass p-8 rounded-[2rem] max-w-2xl space-y-5">
                  <div><label className={label}>Full Name</label><input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Nayan Kuikel" className={inp} /></div>
                  <div><label className={label}>Professional Title / Subtitle</label><input value={profileSubtitle} onChange={e => setProfileSubtitle(e.target.value)} placeholder="Civil Engineer..." className={inp} /></div>
                  <div><label className={label}>Bio</label><textarea value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="About you..." className={`${inp} min-h-[140px] resize-none`} /></div>
                  <div><label className={label}>Email</label><input value={profileEmail} onChange={e => setProfileEmail(e.target.value)} placeholder="admin@example.com" className={inp} /></div>
                  <div><label className={label}>Phone</label><input value={profilePhone} onChange={e => setProfilePhone(e.target.value)} placeholder="+977-XXXXXXXXXX" className={inp} /></div>
                  <button onClick={updateProfile} className="group bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                    <Check size={16} /> Save Profile
                  </button>
                </div>
              </div>
            )}

            {/* ── EXPERIENCE ── */}
            {activeTab === 'experience' && (
              <div>
                <SectionHeading title={editingExp ? 'Edit' : 'Add'} subtitle="Experience" />
                <div className="grid xl:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-[2rem] space-y-5">
                    <div><label className={label}>Role *</label><input value={expRole} onChange={e => setExpRole(e.target.value)} placeholder="Site Engineer" className={inp} /></div>
                    <div><label className={label}>Company *</label><input value={expCompany} onChange={e => setExpCompany(e.target.value)} placeholder="Company name" className={inp} /></div>
                    <div><label className={label}>Period</label><input value={expPeriod} onChange={e => setExpPeriod(e.target.value)} placeholder="2024 - Present" className={inp} /></div>
                    <div><label className={label}>Description</label><textarea value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Responsibilities..." className={`${inp} min-h-[100px] resize-none`} /></div>
                    <div className="flex gap-3">
                      <button onClick={saveExp} className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Check size={16} /> {editingExp ? 'Update' : 'Save'}
                      </button>
                      {editingExp && <button onClick={resetExpForm} className="px-6 py-4 rounded-2xl border-2 border-border font-black uppercase tracking-widest text-[10px] hover:bg-accent transition-all"><X size={16} /></button>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {experience.length === 0 && <div className="glass p-12 rounded-[2rem] text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">No experience yet</div>}
                    {experience.map((e: any) => (
                      <div key={e.id} className="glass p-6 rounded-2xl group hover:border-primary/20 border-2 border-transparent transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-black">{e.role}</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary font-black opacity-60">{e.company} · {e.period}</p>
                            {e.description && <p className="text-sm text-muted-foreground mt-2 font-medium line-clamp-2">{e.description}</p>}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                            <button onClick={() => startEditExp(e)} className="w-9 h-9 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"><Pencil size={14} /></button>
                            <button onClick={() => deleteExp(e.id)} className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all flex items-center justify-center"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── GALLERY ── */}
            {activeTab === 'gallery' && (
              <div>
                <SectionHeading title="Manage" subtitle="Gallery" />
                <div className="glass p-8 rounded-[2rem] max-w-xl space-y-5 mb-8">
                  <div>
                    <label className={label}>Image File</label>
                    <input type="file" accept="image/*" onChange={e => setGalleryImageFile(e.target.files?.[0] || null)} className={`${inp} cursor-pointer`} />
                  </div>
                  <div>
                    <label className={label}>Grid Span</label>
                    <select value={gallerySpan} onChange={e => setGallerySpan(e.target.value)} className={inp}>
                      <option value="col-span-1 row-span-1">Normal (1×1)</option>
                      <option value="col-span-2 row-span-1">Wide (2×1)</option>
                      <option value="col-span-1 row-span-2">Tall (1×2)</option>
                      <option value="col-span-2 row-span-2">Large (2×2)</option>
                    </select>
                  </div>
                  <button onClick={addGalleryImage} disabled={uploading} className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Upload Image</>}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gallery.map((g: any) => (
                    <div key={g.id} className="relative group aspect-square rounded-2xl overflow-hidden">
                      <img src={g.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <button onClick={() => deleteGalleryItem(g.id)} className="w-10 h-10 bg-destructive text-white rounded-xl flex items-center justify-center"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {gallery.length === 0 && <div className="col-span-4 glass p-12 rounded-[2rem] text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">No images yet</div>}
                </div>
              </div>
            )}

            {/* ── THEME ── */}
            {activeTab === 'theme' && (
              <div>
                <SectionHeading title="Customize" subtitle="Theme" />
                <div className="space-y-8 max-w-2xl">
                  <div className="glass p-8 rounded-[2rem]">
                    <p className={label}>Color Mode</p>
                    <div className="flex gap-4 mt-4">
                      {(['light', 'dark', 'brown'] as const).map(m => (
                        <button key={m} onClick={() => { setMode(m); setDoc(doc(db, 'settings', 'global'), { mode: m }, { merge: true }); }}
                          className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${mode === m ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/30'}`}>
                          {m === 'light' ? <Sun size={20} /> : m === 'dark' ? <Moon size={20} /> : <Coffee size={20} />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="glass p-8 rounded-[2rem]">
                    <p className={label}>Theme Style</p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {themes.map(t => (
                        <button key={t} onClick={() => setGlobalTheme(t)}
                          className={`p-5 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${themeSet === t ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/30'}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── MESSAGES ── */}
            {activeTab === 'messages' && (
              <div>
                <SectionHeading title="Inbox" subtitle="Messages" />
                <div className="space-y-4">
                  {messages.length === 0 && <div className="glass p-16 rounded-[2rem] text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">No messages yet</div>}
                  {messages.map((m: any) => (
                    <div key={m.id} className="glass p-8 rounded-[2rem] group hover:border-primary/20 border-2 border-transparent transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-black">{m.name}</span>
                            <span className="text-[10px] uppercase tracking-widest text-primary font-black opacity-60">{m.email}</span>
                          </div>
                          <p className="text-muted-foreground font-medium">{m.message}</p>
                          {m.createdAt?.toDate && <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">{m.createdAt.toDate().toLocaleDateString()}</p>}
                        </div>
                        <button onClick={() => deleteMessage(m.id)} className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 shrink-0"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {activeTab === 'users' && (
              <div>
                <SectionHeading title="Manage" subtitle="Users" />
                <div className="space-y-4">
                  {users.length === 0 && <div className="glass p-16 rounded-[2rem] text-center text-muted-foreground text-[10px] font-black uppercase tracking-widest opacity-40">No users found</div>}
                  {users.map((u: any) => (
                    <div key={u.id} className="glass p-6 rounded-2xl flex items-center gap-6 group hover:border-primary/20 border-2 border-transparent transition-all">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${u.role === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'}`}>
                        <Shield size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black">{u.email}</p>
                        <p className="text-[10px] uppercase tracking-widest font-black opacity-40">{u.role || 'user'}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => toggleUserRole(u.id, u.role)} className={`px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${u.role === 'admin' ? 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'}`}>
                          {u.role === 'admin' ? 'Revoke' : 'Make Admin'}
                        </button>
                        <button onClick={() => { if (confirm('Delete user record?')) deleteDoc(doc(db, 'users', u.id)).then(() => showToast('User removed')); }} className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all flex items-center justify-center"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && <Toast key={toast.msg} message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}
