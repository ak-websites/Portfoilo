import { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { useTheme, type ThemeSet } from '../store/useTheme';
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
  const { mode, themeSet, setMode, setThemeSet } = useTheme();
  const { hero, about, projects, education, experience } = useContent();
  const [messages, setMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  // Project Form states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState('');
  const [projImage, setProjImage] = useState('');
  const [projLink, setProjLink] = useState('');
  
  // Profile Form states
  const [profileName, setProfileName] = useState(hero?.title || '');
  const [profileSubtitle, setProfileSubtitle] = useState(hero?.subtitle || '');
  const [profileBio, setProfileBio] = useState(about?.bio || '');
  const [profileImage, setProfileImage] = useState(about?.image || '');
  const [profileEducation, setProfileEducation] = useState(about?.education || '');
  const [profileCurrentRole, setProfileCurrentRole] = useState(about?.currentRole || '');
  const [profileSkills, setProfileSkills] = useState('');

  // Experience Form
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDescription, setExpDescription] = useState('');

  // Education Form
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduPeriod, setEduPeriod] = useState('');
  const [eduDescription, setEduDescription] = useState('');

  useEffect(() => {
    if (hero) setProfileName(hero.title || '');
    if (hero) setProfileSubtitle(hero.subtitle || '');
    if (about) {
      setProfileBio(about.bio || '');
      setProfileImage(about.image || '');
      setProfileEducation(about.education || '');
      setProfileCurrentRole(about.currentRole || '');
      setProfileSkills(Array.isArray(about.skills) ? about.skills.join(', ') : '');
    }
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
    if (!projTitle || !projDesc || !projCategory) return alert('Fill all required fields');
    try {
      const payload = {
        title: projTitle,
        description: projDesc,
        category: projCategory,
        image: projImage || '',
        link: projLink || '#',
      };

      if (editingProjectId) {
        await updateDoc(doc(db, 'projects', editingProjectId), payload);
        setEditingProjectId(null);
        alert('Project updated!');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          order: projects.length,
          createdAt: new Date()
        });
        alert('Project added!');
      }
      setProjTitle('');
      setProjDesc('');
      setProjCategory('');
      setProjImage('');
      setProjLink('');
    } catch (err) {
      alert('Error saving project');
    }
  };

  const startEditProject = (p: any) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title);
    setProjDesc(p.description);
    setProjCategory(p.category || '');
    setProjImage(p.image || '');
    setProjLink(p.link || '');
    setActiveTab('projects');
  };

  const deleteProject = async (id: string) => {
    if (confirm('Delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  const updateProfile = async () => {
    try {
      const parsedSkills = profileSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      await setDoc(doc(db, 'content', 'hero'), { title: profileName, subtitle: profileSubtitle }, { merge: true });
      await setDoc(
        doc(db, 'content', 'about'),
        {
          bio: profileBio,
          image: profileImage,
          education: profileEducation,
          currentRole: profileCurrentRole,
          skills: parsedSkills,
        },
        { merge: true }
      );
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
      description: expDescription || '',
      order: experience.length
    });
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    setExpDescription('');
    alert('Experience added!');
  };

  const addEducation = async () => {
    if (!eduDegree || !eduInstitution) return alert('Fill fields');
    await addDoc(collection(db, 'education'), {
      degree: eduDegree,
      institution: eduInstitution,
      period: eduPeriod,
      description: eduDescription || '',
      order: education.length
    });
    setEduDegree('');
    setEduInstitution('');
    setEduPeriod('');
    setEduDescription('');
    alert('Education added!');
  };

  const toggleTheme = async () => {
    const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'brown' : 'light';
    setMode(nextMode);
    await setDoc(doc(db, 'settings', 'global'), { mode: nextMode }, { merge: true });
  };

  const applyThemeSet = async (nextThemeSet: ThemeSet) => {
    setThemeSet(nextThemeSet);
    await setDoc(doc(db, 'settings', 'global'), { themeSet: nextThemeSet }, { merge: true });
  };

  const applyMode = async (nextMode: 'light' | 'dark' | 'brown') => {
    setMode(nextMode);
    await setDoc(doc(db, 'settings', 'global'), { mode: nextMode }, { merge: true });
  };

  const deleteMessage = async (id: string) => {
    if (confirm('Delete message?')) {
      await deleteDoc(doc(db, 'messages', id));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(145deg, #0b0f16, #101826)', color: 'white', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: 'rgba(20, 26, 38, 0.9)', borderRight: '1px solid rgba(122, 162, 255, 0.25)', padding: '22px', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(8px)' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', color: '#8FB2FF', letterSpacing: '1px' }}>ADMIN STUDIO</div>
        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        <button className={`nav-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>Education</button>
        <button className={`nav-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Job Experience</button>
        <button className={`nav-btn ${activeTab === 'theme' ? 'active' : ''}`} onClick={() => setActiveTab('theme')}>Theme</button>
        <button className={`nav-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>
        <button className="nav-btn" onClick={() => navigate('/')}>Exit Site</button>
        <button className="nav-btn" style={{ marginTop: 'auto' }} onClick={logout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        
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
              <input value={projCategory} onChange={e => setProjCategory(e.target.value)} placeholder="Category (e.g. Engineering)" />
              <input value={projImage} onChange={e => setProjImage(e.target.value)} placeholder="Image URL (optional)" />
              <input value={projLink} onChange={e => setProjLink(e.target.value)} placeholder="Project Link (optional)" />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="save" onClick={saveProject}>{editingProjectId ? 'Update' : 'Save'}</button>
                {editingProjectId && <button className="save" style={{ background: '#555' }} onClick={() => { setEditingProjectId(null); setProjTitle(''); setProjDesc(''); setProjCategory(''); setProjImage(''); setProjLink(''); }}>Cancel</button>}
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
                      <p style={{ fontSize: '11px', color: '#888' }}>{p.category || 'Uncategorized'}</p>
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
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>About Profile Image URL</label>
              <input value={profileImage} onChange={e => setProfileImage(e.target.value)} placeholder="https://..." />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Education</label>
              <input value={profileEducation} onChange={e => setProfileEducation(e.target.value)} placeholder="Education" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Current Role</label>
              <input value={profileCurrentRole} onChange={e => setProfileCurrentRole(e.target.value)} placeholder="Current role" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Skills (comma separated)</label>
              <input value={profileSkills} onChange={e => setProfileSkills(e.target.value)} placeholder="Skill 1, Skill 2, Skill 3" />
              <button className="save" onClick={updateProfile}>Update</button>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="section active">
            <div className="card">
              <h3>Add Education</h3>
              <input value={eduDegree} onChange={e => setEduDegree(e.target.value)} placeholder="Degree / Program" />
              <input value={eduInstitution} onChange={e => setEduInstitution(e.target.value)} placeholder="Institution" />
              <input value={eduPeriod} onChange={e => setEduPeriod(e.target.value)} placeholder="Period (e.g. 2022 - 2026)" />
              <textarea value={eduDescription} onChange={e => setEduDescription(e.target.value)} placeholder="Description (optional)" style={{ minHeight: '100px' }}></textarea>
              <button className="save" onClick={addEducation}>Save</button>
            </div>
            <div className="card">
              <h3>Education List</h3>
              {education.map((e: any) => (
                <div key={e.id} style={{ borderBottom: '1px solid #2c3445', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p><b>{e.degree}</b> at {e.institution} ({e.period})</p>
                    {e.description && <p style={{ fontSize: '12px', color: '#b4bccb', marginTop: '4px' }}>{e.description}</p>}
                  </div>
                  <button onClick={() => deleteDoc(doc(db, 'education', e.id))} style={{ background: '#ff4444', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="section active">
            <div className="card">
              <h3>Add Job Experience</h3>
              <input value={expRole} onChange={e => setExpRole(e.target.value)} placeholder="Role" />
              <input value={expCompany} onChange={e => setExpCompany(e.target.value)} placeholder="Company" />
              <input value={expPeriod} onChange={e => setExpPeriod(e.target.value)} placeholder="Period (e.g. 2023 - Present)" />
              <textarea value={expDescription} onChange={e => setExpDescription(e.target.value)} placeholder="Description (optional)" style={{ minHeight: '100px' }}></textarea>
              <button className="save" onClick={addExperience}>Save</button>
            </div>
            <div className="card">
              <h3>Job Experience List</h3>
              {experience.map((e: any) => (
                <div key={e.id} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p><b>{e.role}</b> at {e.company} ({e.period})</p>
                    {e.description && <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>{e.description}</p>}
                  </div>
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
              <p style={{ marginBottom: '15px' }}>
                Current Mode: <b style={{ textTransform: 'uppercase' }}>{mode}</b> | Theme: <b style={{ textTransform: 'uppercase' }}>{themeSet}</b>
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="save alt" onClick={() => applyMode('light')}>Light</button>
                <button className="save alt" onClick={() => applyMode('dark')}>Dark</button>
                <button className="save alt" onClick={() => applyMode('brown')}>Brown</button>
                <button className="save" onClick={toggleTheme}>Toggle Mode</button>
              </div>
            </div>
            <div className="card">
              <h3>Theme Sets (All 6)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {(['architectural', 'concrete', 'luxury', 'nordic', 'precision', 'blueprint'] as ThemeSet[]).map((theme) => (
                  <button
                    key={theme}
                    className={`theme-chip ${themeSet === theme ? 'active' : ''}`}
                    onClick={() => applyThemeSet(theme)}
                  >
                    {theme}
                  </button>
                ))}
              </div>
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
          padding: 12px 14px;
          margin-bottom: 10px;
          background: rgba(0, 0, 0, 0.12);
          border: 1px solid #2f3a52;
          color: #c5d1e8;
          cursor: pointer;
          text-align: left;
          transition: 0.3s;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          width: 100%;
          border-radius: 10px;
        }
        .nav-btn:hover, .nav-btn.active {
          background: linear-gradient(135deg, #4361ee, #4a90d9);
          color: white;
          border-color: #6da9ff;
          transform: translateY(-1px);
        }
        .card {
          background: rgba(22, 29, 42, 0.9);
          padding: 30px;
          margin-bottom: 20px;
          border-radius: 14px;
          border: 1px solid #2f3a52;
          box-shadow: 0 20px 35px rgba(0, 0, 0, 0.25);
        }
        input, textarea {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          background: #0e1420;
          border: 1px solid #334260;
          color: white;
          font-family: inherit;
          border-radius: 8px;
        }
        button.save {
          margin-top: 20px;
          padding: 12px 25px;
          background: linear-gradient(135deg, #3f7be0, #56a3f6);
          border: none;
          cursor: pointer;
          color: white;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
          border-radius: 8px;
        }
        button.save.alt {
          margin-top: 0;
          background: #24324f;
          border: 1px solid #395383;
        }
        .theme-chip {
          padding: 12px;
          border: 1px solid #334260;
          background: #111a2b;
          color: #d7e2f7;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 11px;
          border-radius: 10px;
          cursor: pointer;
        }
        .theme-chip.active {
          background: linear-gradient(135deg, #4361ee, #4a90d9);
          border-color: #6da9ff;
          color: #fff;
        }
        .section { display: none; }
        .section.active { display: block; }
      `}</style>
    </div>
  );
}
