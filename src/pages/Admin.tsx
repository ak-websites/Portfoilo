import { useState, useEffect } from 'react';
import { db, auth, storage } from '../lib/firebase';
import { useTheme, type ThemeSet } from '../store/useTheme';
import { useContent } from '../store/useContent';
import '../admin.css';
import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { sanitizeImageUrl, sanitizeUrl } from '../utils/security';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { mode, themeSet, setMode, setThemeSet } = useTheme();
  const { hero, about, contact, projects, education, experience, gallery } = useContent();
  const [messages, setMessages] = useState<any[]>([]);
  const navigate = useNavigate();

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projCategory, setProjCategory] = useState('');
  const [projImage, setProjImage] = useState('');
  const [projImageFile, setProjImageFile] = useState<File | null>(null);
  const [projUploading, setProjUploading] = useState(false);
  const [projLink, setProjLink] = useState('');

  const [profileName, setProfileName] = useState(hero?.title || '');
  const [profileBadge, setProfileBadge] = useState(hero?.badge || '');
  const [profileSubtitle, setProfileSubtitle] = useState(hero?.subtitle || '');
  const [profileBio, setProfileBio] = useState(about?.bio || '');
  const [profileImage, setProfileImage] = useState(about?.image || '');
  const [profileEducation, setProfileEducation] = useState(about?.education || '');
  const [profileCurrentRole, setProfileCurrentRole] = useState(about?.currentRole || '');
  const [profileLinkedIn, setProfileLinkedIn] = useState(about?.linkedin || '');
  const [contactHeadline, setContactHeadline] = useState(contact?.headline || '');
  const [contactLinkedInLabel, setContactLinkedInLabel] = useState(contact?.linkedinLabel || '');
  const [contactEmail, setContactEmail] = useState(contact?.email || '');
  const [contactPhone, setContactPhone] = useState(contact?.phone || '');
  const [profileSkills, setProfileSkills] = useState('');

  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDescription, setExpDescription] = useState('');

  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduPeriod, setEduPeriod] = useState('');
  const [eduDescription, setEduDescription] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');
  const [gallerySpan, setGallerySpan] = useState('col-span-1 row-span-1');
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);

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
    if (contact) {
      setContactHeadline(contact.headline || '');
      setContactLinkedInLabel(contact.linkedinLabel || '');
      setContactEmail(contact.email || '');
      setContactPhone(contact.phone || '');
    }
  }, [hero, about, contact]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (s) => setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const logout = () => {
    auth.signOut();
    navigate('/login');
  };

  const saveProject = async () => {
    if (!projTitle || !projDesc || !projCategory) return alert('Fill all required fields');
    const safeProjectImage = sanitizeImageUrl(projImage, '');
    const safeProjectLink = sanitizeUrl(projLink, '#');
    try {
      const payload = {
        title: projTitle,
        description: projDesc,
        category: projCategory,
        image: safeProjectImage,
        link: safeProjectLink,
      };

      if (editingProjectId) {
        await updateDoc(doc(db, 'projects', editingProjectId), payload);
        alert('Project updated!');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          order: projects.length,
          createdAt: new Date(),
        });
        alert('Project added!');
      }
      resetProjectForm();
    } catch {
      alert('Error saving project');
    }
  };

  const uploadProjectImage = async () => {
    if (!projImageFile) return alert('Choose an image first');
    try {
      setProjUploading(true);
      const imageRef = ref(storage, `projects/${Date.now()}-${projImageFile.name}`);
      await uploadBytes(imageRef, projImageFile);
      const url = await getDownloadURL(imageRef);
      setProjImage(url);
      alert('Project image uploaded and filled!');
    } catch {
      alert('Error uploading project image');
    } finally {
      setProjUploading(false);
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitle('');
    setProjDesc('');
    setProjCategory('');
    setProjImage('');
    setProjImageFile(null);
    setProjLink('');
  };

  const startEditProject = (project: any) => {
    setEditingProjectId(project.id);
    setProjTitle(project.title || '');
    setProjDesc(project.description || '');
    setProjCategory(project.category || '');
    setProjImage(project.image || '');
    setProjLink(project.link || '');
    setActiveTab('projects');
  };

  const removeProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteDoc(doc(db, 'projects', id));
  };

  const updateProfile = async () => {
    try {
      const parsedSkills = profileSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

      await setDoc(
        doc(db, 'content', 'hero'),
        { title: profileName, badge: profileBadge, subtitle: profileSubtitle },
        { merge: true }
      );
      await setDoc(
        doc(db, 'content', 'about'),
        {
          bio: profileBio,
          image: profileImage,
          education: profileEducation,
          currentRole: profileCurrentRole,
          linkedin: profileLinkedIn,
          skills: parsedSkills,
        },
        { merge: true }
      );
      await setDoc(
        doc(db, 'content', 'contact'),
        {
          headline: contactHeadline,
          email: contactEmail,
          phone: contactPhone,
          linkedin: profileLinkedIn,
          linkedinLabel: contactLinkedInLabel,
        },
        { merge: true }
      );
      alert('Profile updated!');
    } catch {
      alert('Error updating profile');
    }
  };

  const saveExperience = async () => {
    if (!expRole || !expCompany) return alert('Fill fields');
    if (editingExperienceId) {
      await updateDoc(doc(db, 'experience', editingExperienceId), {
        role: expRole,
        company: expCompany,
        period: expPeriod,
        description: expDescription || '',
      });
      alert('Experience updated!');
    } else {
      await addDoc(collection(db, 'experience'), {
        role: expRole,
        company: expCompany,
        period: expPeriod,
        description: expDescription || '',
        order: experience.length,
      });
      alert('Experience added!');
    }
    resetExperienceForm();
  };

  const resetExperienceForm = () => {
    setEditingExperienceId(null);
    setExpRole('');
    setExpCompany('');
    setExpPeriod('');
    setExpDescription('');
  };

  const startEditExperience = (item: any) => {
    setEditingExperienceId(item.id);
    setExpRole(item.role || '');
    setExpCompany(item.company || '');
    setExpPeriod(item.period || '');
    setExpDescription(item.description || '');
    setActiveTab('experience');
  };

  const removeExperience = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await deleteDoc(doc(db, 'experience', id));
  };

  const saveEducation = async () => {
    if (!eduDegree || !eduInstitution) return alert('Fill fields');
    if (editingEducationId) {
      await updateDoc(doc(db, 'education', editingEducationId), {
        degree: eduDegree,
        institution: eduInstitution,
        period: eduPeriod,
        description: eduDescription || '',
      });
      alert('Education updated!');
    } else {
      await addDoc(collection(db, 'education'), {
        degree: eduDegree,
        institution: eduInstitution,
        period: eduPeriod,
        description: eduDescription || '',
        order: education.length,
      });
      alert('Education added!');
    }
    resetEducationForm();
  };

  const resetEducationForm = () => {
    setEditingEducationId(null);
    setEduDegree('');
    setEduInstitution('');
    setEduPeriod('');
    setEduDescription('');
  };

  const startEditEducation = (item: any) => {
    setEditingEducationId(item.id);
    setEduDegree(item.degree || '');
    setEduInstitution(item.institution || '');
    setEduPeriod(item.period || '');
    setEduDescription(item.description || '');
    setActiveTab('education');
  };

  const removeEducation = async (id: string) => {
    if (!confirm('Delete this education item?')) return;
    await deleteDoc(doc(db, 'education', id));
  };

  const addGalleryItem = async () => {
    const safeGalleryUrl = sanitizeImageUrl(galleryUrl, '');
    if (!safeGalleryUrl) return alert('Add a valid image URL');
    await addDoc(collection(db, 'gallery'), {
      url: safeGalleryUrl,
      span: gallerySpan,
      order: gallery.length,
      createdAt: new Date(),
    });
    setGalleryUrl('');
    setGallerySpan('col-span-1 row-span-1');
    setGalleryImageFile(null);
    alert('Visual portfolio item added!');
  };

  const uploadGalleryImage = async () => {
    if (!galleryImageFile) return alert('Choose an image first');
    try {
      setGalleryUploading(true);
      const imageRef = ref(storage, `gallery/${Date.now()}-${galleryImageFile.name}`);
      await uploadBytes(imageRef, galleryImageFile);
      const url = await getDownloadURL(imageRef);
      setGalleryUrl(url);
      alert('Visual image uploaded and filled!');
    } catch {
      alert('Error uploading gallery image');
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryItem = async (id: string) => {
    if (!confirm('Delete this visual portfolio item?')) return;
    await deleteDoc(doc(db, 'gallery', id));
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
    <div style={{ display: 'flex', height: '100vh', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ width: '250px', background: 'hsl(var(--card))', borderRight: '1px solid hsl(var(--border))', padding: '22px', display: 'flex', flexDirection: 'column', backdropFilter: 'blur(8px)' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px', color: 'hsl(var(--primary))', letterSpacing: '1px' }}>ADMIN STUDIO</div>
        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={`nav-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
        <button className={`nav-btn ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')}>Education</button>
        <button className={`nav-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Job Experience</button>
        <button className={`nav-btn ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Visual Portfolio</button>
        <button className={`nav-btn ${activeTab === 'theme' ? 'active' : ''}`} onClick={() => setActiveTab('theme')}>Theme</button>
        <button className={`nav-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>
        <button className="nav-btn" onClick={() => navigate('/')}>Exit Site</button>
        <button className="nav-btn" style={{ marginTop: 'auto' }} onClick={logout}>Logout</button>
      </div>

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
              <input value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="Project title" />
              <textarea value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Description" style={{ minHeight: '100px' }} />
              <input value={projCategory} onChange={(e) => setProjCategory(e.target.value)} placeholder="Category (e.g. Engineering)" />
              <input value={projImage} onChange={(e) => setProjImage(e.target.value)} placeholder="Image URL (optional)" />
              {projImage && (
                <img
                  src={sanitizeImageUrl(projImage)}
                  alt="Project preview"
                  style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #333', marginTop: '10px' }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProjImageFile(e.target.files?.[0] || null)}
              />
              <button className="save alt" onClick={uploadProjectImage} disabled={projUploading}>
                {projUploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <input value={projLink} onChange={(e) => setProjLink(e.target.value)} placeholder="Project Link (optional)" />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="save" onClick={saveProject}>{editingProjectId ? 'Update' : 'Save'}</button>
                {editingProjectId && <button className="save" style={{ background: '#555' }} onClick={resetProjectForm}>Cancel</button>}
              </div>
            </div>
            <div className="card">
              <h3>Project List</h3>
              {projects.map((project: any) => (
                <div key={project.id} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <p><b>{project.title}</b> ({project.category})</p>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>{project.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="save alt" onClick={() => startEditProject(project)}>Edit</button>
                    <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeProject(project.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="section active">
            <div className="card">
              <h3>Edit Profile</h3>
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Name</label>
              <input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Name" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Hero Badge</label>
              <input value={profileBadge} onChange={(e) => setProfileBadge(e.target.value)} placeholder="Civil Engineer" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Professional Title</label>
              <input value={profileSubtitle} onChange={(e) => setProfileSubtitle(e.target.value)} placeholder="Title" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Bio</label>
              <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} placeholder="Bio" style={{ minHeight: '150px' }} />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>About Profile Image URL</label>
              <input value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://..." />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Education</label>
              <input value={profileEducation} onChange={(e) => setProfileEducation(e.target.value)} placeholder="Education" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Current Role</label>
              <input value={profileCurrentRole} onChange={(e) => setProfileCurrentRole(e.target.value)} placeholder="Current role" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Email</label>
              <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="admin@nayankuikel.com" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Phone</label>
              <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+977-XXXXXXXXXX" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Contact Headline</label>
              <textarea value={contactHeadline} onChange={(e) => setContactHeadline(e.target.value)} placeholder="Available for new opportunities..." style={{ minHeight: '90px' }} />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>LinkedIn URL</label>
              <input value={profileLinkedIn} onChange={(e) => setProfileLinkedIn(e.target.value)} placeholder="https://www.linkedin.com/in/..." />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>LinkedIn Label</label>
              <input value={contactLinkedInLabel} onChange={(e) => setContactLinkedInLabel(e.target.value)} placeholder="Nayan Kuikel" />
              <label style={{ fontSize: '12px', color: '#aaa', marginTop: '10px', display: 'block' }}>Skills (comma separated)</label>
              <input value={profileSkills} onChange={(e) => setProfileSkills(e.target.value)} placeholder="Skill 1, Skill 2, Skill 3" />
              <button className="save" onClick={updateProfile}>Update</button>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="section active">
            <div className="card">
              <h3>{editingEducationId ? 'Edit Education' : 'Add Education'}</h3>
              <input value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} placeholder="Degree / Program" />
              <input value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} placeholder="Institution" />
              <input value={eduPeriod} onChange={(e) => setEduPeriod(e.target.value)} placeholder="Period (e.g. 2022 - 2026)" />
              <textarea value={eduDescription} onChange={(e) => setEduDescription(e.target.value)} placeholder="Description (optional)" style={{ minHeight: '100px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="save" onClick={saveEducation}>{editingEducationId ? 'Update' : 'Save'}</button>
                {editingEducationId && <button className="save" style={{ background: '#555' }} onClick={resetEducationForm}>Cancel</button>}
              </div>
            </div>
            <div className="card">
              <h3>Education List</h3>
              {education.map((item: any) => (
                <div key={item.id} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <p><b>{item.degree}</b> at {item.institution}</p>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>{item.period}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="save alt" onClick={() => startEditEducation(item)}>Edit</button>
                    <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeEducation(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="section active">
            <div className="card">
              <h3>{editingExperienceId ? 'Edit Job Experience' : 'Add Job Experience'}</h3>
              <input value={expRole} onChange={(e) => setExpRole(e.target.value)} placeholder="Role" />
              <input value={expCompany} onChange={(e) => setExpCompany(e.target.value)} placeholder="Company" />
              <input value={expPeriod} onChange={(e) => setExpPeriod(e.target.value)} placeholder="Period (e.g. 2023 - Present)" />
              <textarea value={expDescription} onChange={(e) => setExpDescription(e.target.value)} placeholder="Description (optional)" style={{ minHeight: '100px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="save" onClick={saveExperience}>{editingExperienceId ? 'Update' : 'Save'}</button>
                {editingExperienceId && <button className="save" style={{ background: '#555' }} onClick={resetExperienceForm}>Cancel</button>}
              </div>
            </div>
            <div className="card">
              <h3>Job Experience List</h3>
              {experience.map((item: any) => (
                <div key={item.id} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <p><b>{item.role}</b> at {item.company}</p>
                    <p style={{ fontSize: '12px', color: '#aaa' }}>{item.period}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="save alt" onClick={() => startEditExperience(item)}>Edit</button>
                    <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeExperience(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="section active">
            <div className="card">
              <h3>Add Visual Portfolio Item</h3>
              <input
                value={galleryUrl}
                onChange={(e) => setGalleryUrl(e.target.value)}
                placeholder="Image URL"
              />
              {galleryUrl && (
                <img
                  src={sanitizeImageUrl(galleryUrl)}
                  alt="Visual preview"
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #333', marginTop: '10px' }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setGalleryImageFile(e.target.files?.[0] || null)}
              />
              <button className="save alt" onClick={uploadGalleryImage} disabled={galleryUploading}>
                {galleryUploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <select value={gallerySpan} onChange={(e) => setGallerySpan(e.target.value)}>
                <option value="col-span-1 row-span-1">Normal (1x1)</option>
                <option value="col-span-2 row-span-1">Wide (2x1)</option>
                <option value="col-span-1 row-span-2">Tall (1x2)</option>
                <option value="col-span-2 row-span-2">Large (2x2)</option>
              </select>
              <button className="save" onClick={addGalleryItem}>Add Visual</button>
            </div>
            <div className="card">
              <h3>Visual Portfolio List</h3>
              {gallery.map((item: any) => (
                <div key={item.id} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img
                      src={sanitizeImageUrl(item.url)}
                      alt="Portfolio visual"
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }}
                    />
                    <div>
                      <p style={{ fontSize: '13px' }}>{item.url}</p>
                      <p style={{ fontSize: '11px', color: '#888' }}>{item.span || 'col-span-1 row-span-1'}</p>
                    </div>
                  </div>
                  <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeGalleryItem(item.id)}>Delete</button>
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
                  <button key={theme} className={`theme-chip ${themeSet === theme ? 'active' : ''}`} onClick={() => applyThemeSet(theme)}>
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
    </div>
  );
}
