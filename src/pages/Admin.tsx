import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Layout, 
  Briefcase, 
  Image as ImageIcon, 
  Mail, 
  Palette,
  Save
} from 'lucide-react';
import { db } from '../lib/firebase';
import { useTheme } from '../store/useTheme';
import { useContent } from '../store/useContent';
import { doc, updateDoc } from 'firebase/firestore';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('settings');
  const { themeSet, mode } = useTheme();
  const { hero, about } = useContent();

  const handleUpdateGlobal = async (collName: string, docId: string, data: any) => {
    try {
      await updateDoc(doc(db, collName, docId), data);
      alert('Updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating document');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-background/50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-6 hidden md:block space-y-2">
        <h2 className="text-xl font-bold mb-6 px-2">Admin Panel</h2>
        <AdminNavLink icon={<Settings size={18} />} label="Theme & Global" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        <AdminNavLink icon={<Layout size={18} />} label="Hero Section" active={activeTab === 'hero'} onClick={() => setActiveTab('hero')} />
        <AdminNavLink icon={<Layout size={18} />} label="About Section" active={activeTab === 'about'} onClick={() => setActiveTab('about')} />
        <AdminNavLink icon={<Briefcase size={18} />} label="Experience" active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} />
        <AdminNavLink icon={<ImageIcon size={18} />} label="Projects" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
        <AdminNavLink icon={<Mail size={18} />} label="Messages" active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <section className="glass p-8 rounded-3xl border border-border shadow-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Palette className="text-primary" /> Theme Control Panel
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium">Theme Set</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['architectural', 'concrete', 'luxury', 'nordic', 'precision', 'blueprint'].map((t) => (
                        <button
                          key={t}
                          onClick={() => handleUpdateGlobal('settings', 'global', { themeSet: t })}
                          className={`px-4 py-2 rounded-lg border text-sm capitalize transition-all ${themeSet === t ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium">Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['light', 'dark', 'brown'].map((m) => (
                        <button
                          key={m}
                          onClick={() => handleUpdateGlobal('settings', 'global', { mode: m })}
                          className={`px-4 py-2 rounded-lg border text-sm capitalize transition-all ${mode === m ? 'bg-primary text-primary-foreground border-primary' : 'hover:border-primary'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'hero' && (
             <HeroEditor data={hero} onUpdate={(data: any) => handleUpdateGlobal('content', 'hero', data)} />
          )}

          {activeTab === 'about' && (
             <AboutEditor data={about} onUpdate={(data: any) => handleUpdateGlobal('content', 'about', data)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AdminNavLink({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function HeroEditor({ data, onUpdate }: any) {
  const [values, setValues] = useState(data || {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h3 className="text-2xl font-bold">Hero Section Editor</h3>
      <div className="glass p-8 rounded-3xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input 
            value={values.title || ''} 
            onChange={(e) => setValues({...values, title: e.target.value})}
            className="w-full bg-background border border-border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <textarea 
            value={values.subtitle || ''} 
            onChange={(e) => setValues({...values, subtitle: e.target.value})}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Badge</label>
          <input 
            value={values.badge || ''} 
            onChange={(e) => setValues({...values, badge: e.target.value})}
            className="w-full bg-background border border-border rounded-lg px-4 py-2"
          />
        </div>
        <button 
          onClick={() => onUpdate(values)}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>
    </motion.div>
  );
}

function AboutEditor({ data, onUpdate }: any) {
  const [values, setValues] = useState(data || {});

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h3 className="text-2xl font-bold">About Section Editor</h3>
      <div className="glass p-8 rounded-3xl space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea 
            value={values.bio || ''} 
            onChange={(e) => setValues({...values, bio: e.target.value})}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 h-48"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input 
            value={values.image || ''} 
            onChange={(e) => setValues({...values, image: e.target.value})}
            className="w-full bg-background border border-border rounded-lg px-4 py-2"
          />
        </div>
        <button 
          onClick={() => onUpdate(values)}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>
    </motion.div>
  );
}
