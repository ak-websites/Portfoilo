import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { useTheme } from '../store/useTheme';
import { useContent } from '../store/useContent';
import { 
  doc, 
  collection, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { mode, setMode } = useTheme();
  const { hero, about, projects, experience } = useContent();
  const [messages, setMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  // Project Form states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  
  // Profile Form states
  const [profileName, setProfileName] = useState(hero?.title || '');
  const [profileSubtitle, setProfileSubtitle] = useState(hero?.subtitle || '');
  const [profileBio, setProfileBio] = useState(about?.bio || '');

  // Experience Form
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');

  useEffect(() => {
    if (hero) setProfileName(hero.title || '');
    if (hero) setProfileSubtitle(hero.subtitle || '');
    if (about) setProfileBio(about.bio || '');
  }, [hero, about]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const logout = () => {
    auth.signOut();
    navigate('/login');
  };

  const saveProject = async () => {
    if (!projTitle || !projDesc) return alert('Fill all fields');
    try {
      if (editingProjectId) {
        await updateDoc(doc(db, 'projects', editingProjectId), {
          title: projTitle,
          description: projDesc
        });
        setEditingProjectId(null);
        alert('Project updated!');
      } else {
        await addDoc(collection(db, 'projects'), {
          title: projTitle,
          description: projDesc,
          category: 'Structural',
          order: projects.length,
          createdAt: new Date()
        });
        alert('Project added!');
      }
      setProjTitle('');
      setProjDesc('');
    } catch (err) {
      alert('Error saving project');
    }
  };

  const startEditProject = (p: any) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjDesc(p.description);
    setActiveTab('projects');
  };

  const deleteProject = async (id: string) => {
    if (confirm('Delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  const updateProfile = async () => {
    try {
      await setDoc(doc(db, 'content', 'hero'), { title: profileName, subtitle: profileSubtitle }, { merge: true });
      await setDoc(doc(db, 'content', 'about'), { bio: profileBio }, { merge: true });
      alert('Profile updated!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  const addExperience = async () => {
    if (!expRole || !expCompany) return alert('Fill fields');
    await addDoc(collection(db, 'experience'), {
      role: expRole,
      company: expCompany,
      period: expPeriod,
      order: experience.length
    });
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    alert('Experience added!');
  };

  const toggleTheme = async () => {
    const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'brown' : 'light';
    setMode(nextMode);
    await setDoc(doc(db, 'settings', 'global'), { mode: nextMode }, { merge: true });
  };

  const deleteMessage = async (id: string) => {
    if (confirm('Delete message?')) {
      await deleteDoc(doc(db, 'messages', id));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f0f', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '220px', background: '#1c1c1c', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', color: '#4A90D9' }}>ADMIN</div>
        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        <button className={`nav-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Experience</button>
        <button className={`nav-btn ${activeTab === 'theme' ? 'active' : ''}`} onClick={() => setActiveTab('theme')}>Theme</button>
        <button className={`nav-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>
        <button className="nav-btn" onClick={() => navigate('/')}>Exit Site</button>
        <button className="nav-btn" style={{ marginTop: 'auto' }} onClick={logout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
        {activeTab === 'dashboard' && (
          <div className="section active">
            <div className="card">
              <h2>Welcome Admin</h2>
              <p>Manage your website content easily from here.</p>
              <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
                <p>Logged in as: {auth.currentUser?.email}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="section active">
            <div className="card">
              <h3>{editingProjectId ? 'Edit Project' : 'Add Project'}</h3>
              <input value={projTitle} onChange={e => setProjTitle(e.target.value)} placeholder="Project title" />
              <textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} placeholder="Description" style={{ minHeight: '100px' }}></textarea>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="save" onClick={saveProject}>{editingProjectId ? 'Update' : 'Save'}</button>
                {editingProjectId && <button className="save" style={{ background: '#555' }} onClick={() => { setEditingProjectId(null); setProjTitle(''); setProjDesc(''); }}>Cancel</button>}
              </div>
            </div>

            <div className="card">
              <h3>Project List</h3>
              <div id="projectList">
                {projects.map((p: any) => (
                  <div key={p.id} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p><b>{p.title}</b></p>
                      <p style={{ fontSize: '12px', color: '#aaa' }}>{p.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => startEditProject(p)} style={{ background: '#4A90D9', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => deleteProject(p.id)} style={{ background: '#ff4444', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="section active">
            <div className="card">
              <h3>Edit Profile</h3>
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Name</label>
              <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Name" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Professional Title</label>
              <input value={profileSubtitle} onChange={e => setProfileSubtitle(e.target.value)} placeholder="Title" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Bio</label>
              <textarea value={profileBio} onChange={e => setProfileBio(e.target.value)} placeholder="Bio" style={{ minHeight: '150px' }}></textarea>
              <button className="save" onClick={updateProfile}>Update</button>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="section active">
            <div className="card">
              <h3>Add Experience</h3>
              <input value={expRole} onChange={e => setExpRole(e.target.value)} placeholder="Role" />
              <input value={expCompany} onChange={e => setExpCompany(e.target.value)} placeholder="Company" />
              <input value={expPeriod} onChange={e => setExpPeriod(e.target.value)} placeholder="Period (e.g. 2023 - Present)" />
              <button className="save" onClick={addExperience}>Save</button>
            </div>
            <div className="card">
              <h3>Experience List</h3>
              {experience.map((e: any) => (
                <div key={e.id} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <p><b>{e.role}</b> at {e.company} ({e.period})</p>
                  <button onClick={() => deleteDoc(doc(db, 'experience', e.id))} style={{ background: '#ff4444', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="section active">
            <div className="card">
              <h3>Theme Control</h3>
              <p style={{ marginBottom: '15px' }}>Current Mode: <b style={{ textTransform: 'uppercase' }}>{mode}</b></p>
              <button className="save" onClick={toggleTheme}>Toggle Mode</button>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="section active">
            <div className="card">
              <h3>Messages Log</h3>
              {messages.map((m: any) => (
                <div key={m.id} style={{ borderBottom: '1px solid #333', padding: '15px 0', position: 'relative' }}>
                  <p><b>From: {m.name}</b> ({m.email})</p>
                  <p style={{ margin: '10px 0', fontSize: '14px' }}>{m.message}</p>
                  <button onClick={() => deleteMessage(m.id)} style={{ position: 'absolute', top: '15px', right: '0', background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '2px 8px', cursor: 'pointer', fontSize: '10px' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        .nav-btn {
          padding: 12px;
          margin-bottom: 10px;
          background: transparent;
          border: 1px solid #333;
          color: #aaa;
          cursor: pointer;
          text-align: left;
          transition: 0.3s;
          font-size: 14px;
          width: 100%;
        }
        .nav-btn:hover, .nav-btn.active {
          background: #4A90D9;
          color: white;
          border-color: #4A90D9;
        }
        .card {
          background: #1c1c1c;
          padding: 30px;
          margin-bottom: 20px;
          border-radius: 8px;
          border: 1px solid #333;
        }
        input, textarea {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          background: #0f0f0f;
          border: 1px solid #333;
          color: white;
          font-family: inherit;
        }
        button.save {
          margin-top: 20px;
          padding: 12px 25px;
          background: #4A90D9;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
        }
        .section { display: none; }
        .section.active { display: block; }
      `}</style>
    </div>
  );
}
