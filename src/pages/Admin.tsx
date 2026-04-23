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
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { sanitizeImageUrl, sanitizeUrl } from '../utils/security';
import { useAuth } from '../store/useAuth';
import type { SocialLinkItem } from '../lib/socialPlatforms';
import SocialLinksPanel from '../components/admin/SocialLinksPanel';

// ── Skill Category types ──────────────────────────────────────
interface SkillItem { name: string; level: number; }
interface SkillCategory { label: string; skills: SkillItem[]; }

// ── Admin User type ───────────────────────────────────────────
interface AdminUser { id: string; email: string; role: string; }

export default function Admin() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { mode, themeSet, setMode, setThemeSet } = useTheme();
  const { hero, about, contact, projects, education, experience, gallery } = useContent();
  const { user: currentUser } = useAuth();
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

  // Profile / Hero fields
  const [profileName, setProfileName] = useState('');
  const [profileBadge, setProfileBadge] = useState('');
  const [profileSubtitle, setProfileSubtitle] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [profileEducation, setProfileEducation] = useState('');
  const [profileCurrentRole, setProfileCurrentRole] = useState('');
  const [profileLinkedIn, setProfileLinkedIn] = useState('');
  const [profileSkills, setProfileSkills] = useState('');
  const [contactHeadline, setContactHeadline] = useState('');
  const [contactLinkedInLabel, setContactLinkedInLabel] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [profileFirstJobYear, setProfileFirstJobYear] = useState('');
  const [profileProjectCount, setProfileProjectCount] = useState('');
  const [profileTeamsLed, setProfileTeamsLed] = useState('');
  const [profileLocation, setProfileLocation] = useState('');

  // Experience fields
  const [expRole, setExpRole] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDescription, setExpDescription] = useState('');

  // Education fields
  const [eduDegree, setEduDegree] = useState('');
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduPeriod, setEduPeriod] = useState('');
  const [eduDescription, setEduDescription] = useState('');

  // Gallery fields
  const [galleryUrl, setGalleryUrl] = useState('');
  const [gallerySpan, setGallerySpan] = useState('col-span-1 row-span-1');
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // ── Skills state ──────────────────────────────────────────────
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [editingCatIdx, setEditingCatIdx] = useState<number | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(80);

  // ── Admin Management state ────────────────────────────────────
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    if (hero) {
      setProfileName(hero.title || '');
      setProfileSubtitle(hero.subtitle || '');
      setProfileBadge(hero.badge || '');
    }
    if (about) {
      setProfileBio(about.bio || '');
      setProfileImage(about.image || '');
      setProfileEducation(about.education || '');
      setProfileCurrentRole(about.currentRole || '');
      setProfileSkills(Array.isArray(about.skills) ? about.skills.join(', ') : '');
      setProfileFirstJobYear(about.firstJobYear?.toString() || '');
      setProfileProjectCount(about.projectCount?.toString() || '');
      setProfileTeamsLed(about.teamsLed?.toString() || '');
      setProfileLocation(about.location || '');
      if (about.skillCategories?.length > 0) {
        setSkillCategories(about.skillCategories);
      }
    }
    if (contact) {
      setContactHeadline(contact.headline || '');
      setContactLinkedInLabel(contact.linkedinLabel || '');
      setContactEmail(contact.email || '');
      setContactPhone(contact.phone || '');
      setSocialLinks(Array.isArray(contact.socialLinks) ? contact.socialLinks : []);
    }
  }, [hero, about, contact]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (s) => setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  // Load all users for admin management
  useEffect(() => {
    if (activeTab !== 'admins') return;
    setAdminLoading(true);
    const q = query(collection(db, 'users'));
    const unsub = onSnapshot(q, (snap) => {
      setAdminUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUser)));
      setAdminLoading(false);
    });
    return () => unsub();
  }, [activeTab]);

  const logout = () => { auth.signOut(); navigate('/login'); };

  // ── Project CRUD ─────────────────────────────────────────────
  const saveProject = async () => {
    if (!projTitle || !projDesc || !projCategory) return alert('Fill all required fields');
    const safeProjectImage = sanitizeImageUrl(projImage, '');
    const safeProjectLink = sanitizeUrl(projLink, '#');
    try {
      const payload = { title: projTitle, description: projDesc, category: projCategory, image: safeProjectImage, link: safeProjectLink };
      if (editingProjectId) {
        await updateDoc(doc(db, 'projects', editingProjectId), payload);
      } else {
        await addDoc(collection(db, 'projects'), { ...payload, order: projects.length, createdAt: new Date() });
      }
      resetProjectForm();
    } catch { alert('Error saving project'); }
  };

  const uploadProjectImage = async () => {
    if (!projImageFile) return alert('Choose an image first');
    try {
      setProjUploading(true);
      const imageRef = ref(storage, `projects/${Date.now()}-${projImageFile.name}`);
      await uploadBytes(imageRef, projImageFile);
      setProjImage(await getDownloadURL(imageRef));
      alert('Project image uploaded!');
    } catch { alert('Error uploading project image'); }
    finally { setProjUploading(false); }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null); setProjTitle(''); setProjDesc('');
    setProjCategory(''); setProjImage(''); setProjImageFile(null); setProjLink('');
  };

  const startEditProject = (project: any) => {
    setEditingProjectId(project.id); setProjTitle(project.title || '');
    setProjDesc(project.description || ''); setProjCategory(project.category || '');
    setProjImage(project.image || ''); setProjLink(project.link || '');
    setActiveTab('projects');
  };

  const removeProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await deleteDoc(doc(db, 'projects', id));
  };

  // ── Profile Save ──────────────────────────────────────────────
  const updateProfile = async () => {
    try {
      const parsedSkills = profileSkills.split(',').map((s) => s.trim()).filter(Boolean);
      await setDoc(doc(db, 'content', 'hero'), { title: profileName, badge: profileBadge, subtitle: profileSubtitle }, { merge: true });
      await setDoc(doc(db, 'content', 'about'), {
        bio: profileBio, image: profileImage, education: profileEducation,
        currentRole: profileCurrentRole, linkedin: profileLinkedIn, skills: parsedSkills,
        firstJobYear: profileFirstJobYear ? parseInt(profileFirstJobYear) : null,
        projectCount: profileProjectCount !== '' ? parseInt(profileProjectCount) : null,
        teamsLed: profileTeamsLed !== '' ? parseInt(profileTeamsLed) : null,
        location: profileLocation || null,
      }, { merge: true });
      await setDoc(doc(db, 'content', 'contact'), {
        headline: contactHeadline, email: contactEmail, phone: contactPhone,
        linkedin: profileLinkedIn, linkedinLabel: contactLinkedInLabel,
      }, { merge: true });
      alert('Profile updated!');
    } catch { alert('Error updating profile'); }
  };

  // ── Skills CRUD ───────────────────────────────────────────────
  const saveSkillCategories = async () => {
    try {
      await setDoc(doc(db, 'content', 'about'), { skillCategories }, { merge: true });
      alert('Skills saved!');
    } catch { alert('Error saving skills'); }
  };

  const addCategory = () => {
    if (!newCatLabel.trim()) return alert('Enter a category name');
    setSkillCategories([...skillCategories, { label: newCatLabel.trim(), skills: [] }]);
    setNewCatLabel('');
  };

  const removeCategory = (idx: number) => {
    if (!confirm('Remove this category?')) return;
    setSkillCategories(skillCategories.filter((_, i) => i !== idx));
    if (editingCatIdx === idx) setEditingCatIdx(null);
  };

  const addSkillToCategory = (catIdx: number) => {
    if (!newSkillName.trim()) return alert('Enter a skill name');
    const updated = [...skillCategories];
    updated[catIdx].skills.push({ name: newSkillName.trim(), level: newSkillLevel });
    setSkillCategories(updated);
    setNewSkillName('');
    setNewSkillLevel(80);
  };

  const removeSkill = (catIdx: number, skillIdx: number) => {
    const updated = [...skillCategories];
    updated[catIdx].skills.splice(skillIdx, 1);
    setSkillCategories(updated);
  };

  const updateSkillLevel = (catIdx: number, skillIdx: number, level: number) => {
    const updated = [...skillCategories];
    updated[catIdx].skills[skillIdx].level = level;
    setSkillCategories(updated);
  };

  // ── Admin Management ──────────────────────────────────────────
  const findUserByEmail = async (email: string) => {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.find(d => d.data().email === email);
  };

  const grantAdmin = async () => {
    if (!newAdminEmail.trim()) return alert('Enter email');
    const userDoc = await findUserByEmail(newAdminEmail.trim());
    if (!userDoc) return alert('User not found. They must log in first to create an account.');
    await updateDoc(doc(db, 'users', userDoc.id), { role: 'admin' });
    setNewAdminEmail('');
    alert(`Admin granted to ${newAdminEmail}`);
  };

  const revokeAdmin = async (userId: string, email: string) => {
    if (userId === currentUser?.uid) return alert('You cannot revoke your own admin access!');
    if (!confirm(`Revoke admin from ${email}?`)) return;
    await updateDoc(doc(db, 'users', userId), { role: 'user' });
  };

  // ── Experience/Education/Gallery (unchanged) ──────────────────
  const saveExperience = async () => {
    if (!expRole || !expCompany) return alert('Fill fields');
    if (editingExperienceId) {
      await updateDoc(doc(db, 'experience', editingExperienceId), { role: expRole, company: expCompany, period: expPeriod, description: expDescription || '' });
    } else {
      await addDoc(collection(db, 'experience'), { role: expRole, company: expCompany, period: expPeriod, description: expDescription || '', order: experience.length });
    }
    resetExperienceForm();
  };

  const resetExperienceForm = () => { setEditingExperienceId(null); setExpRole(''); setExpCompany(''); setExpPeriod(''); setExpDescription(''); };

  const startEditExperience = (item: any) => {
    setEditingExperienceId(item.id); setExpRole(item.role || ''); setExpCompany(item.company || '');
    setExpPeriod(item.period || ''); setExpDescription(item.description || ''); setActiveTab('experience');
  };

  const removeExperience = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await deleteDoc(doc(db, 'experience', id));
  };

  const saveEducation = async () => {
    if (!eduDegree || !eduInstitution) return alert('Fill fields');
    if (editingEducationId) {
      await updateDoc(doc(db, 'education', editingEducationId), { degree: eduDegree, institution: eduInstitution, period: eduPeriod, description: eduDescription || '' });
    } else {
      await addDoc(collection(db, 'education'), { degree: eduDegree, institution: eduInstitution, period: eduPeriod, description: eduDescription || '', order: education.length });
    }
    resetEducationForm();
  };

  const resetEducationForm = () => { setEditingEducationId(null); setEduDegree(''); setEduInstitution(''); setEduPeriod(''); setEduDescription(''); };

  const startEditEducation = (item: any) => {
    setEditingEducationId(item.id); setEduDegree(item.degree || ''); setEduInstitution(item.institution || '');
    setEduPeriod(item.period || ''); setEduDescription(item.description || ''); setActiveTab('education');
  };

  const removeEducation = async (id: string) => {
    if (!confirm('Delete this education item?')) return;
    await deleteDoc(doc(db, 'education', id));
  };

  const addGalleryItem = async () => {
    const safeGalleryUrl = sanitizeImageUrl(galleryUrl, '');
    if (!safeGalleryUrl) return alert('Add a valid image URL');
    await addDoc(collection(db, 'gallery'), { url: safeGalleryUrl, span: gallerySpan, order: gallery.length, createdAt: new Date() });
    setGalleryUrl(''); setGallerySpan('col-span-1 row-span-1'); setGalleryImageFile(null);
  };

  const uploadGalleryImage = async () => {
    if (!galleryImageFile) return alert('Choose an image first');
    try {
      setGalleryUploading(true);
      const imageRef = ref(storage, `gallery/${Date.now()}-${galleryImageFile.name}`);
      await uploadBytes(imageRef, galleryImageFile);
      setGalleryUrl(await getDownloadURL(imageRef));
    } catch { alert('Error uploading gallery image'); }
    finally { setGalleryUploading(false); }
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
    if (confirm('Delete message?')) await deleteDoc(doc(db, 'messages', id));
  };

  const saveSocialLinks = async () => {
    try {
      await setDoc(doc(db, 'content', 'contact'), { socialLinks }, { merge: true });
      alert('Social buttons updated!');
    } catch {
      alert('Error saving social buttons');
    }
  };

  const previewYears = profileFirstJobYear ? new Date().getFullYear() - parseInt(profileFirstJobYear) : null;

  const TABS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'projects', label: 'Projects' },
    { id: 'profile', label: 'Profile' },
    { id: 'social', label: 'Social Buttons' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Job Experience' },
    { id: 'gallery', label: 'Visual Portfolio' },
    { id: 'theme', label: 'Theme' },
    { id: 'messages', label: 'Messages' },
    { id: 'admins', label: 'Admins' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '240px', background: 'hsl(var(--card))', borderRight: '1px solid hsl(var(--border))', padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ fontSize: '18px', fontWeight: 900, marginBottom: '24px', color: 'hsl(var(--primary))', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Admin Studio
        </div>
        {TABS.map((tab) => (
          <button key={tab.id} className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
        <button className="nav-btn" onClick={() => navigate('/')}>← Exit Site</button>
        <button className="nav-btn" style={{ marginTop: 'auto', color: 'hsl(var(--destructive))' }} onClick={logout}>Logout</button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>

        {/* ── DASHBOARD ─────────────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <div className="card">
            <h2 style={{ fontWeight: 900, fontSize: '22px', marginBottom: '8px' }}>Welcome, Admin</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '16px' }}>Manage your portfolio content from here.</p>
            <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))' }}>Logged in as: <b>{auth.currentUser?.email}</b></p>
          </div>
        )}

        {/* ── PROJECTS ──────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <>
            <div className="card">
              <h3>{editingProjectId ? 'Edit Project' : 'Add Project'}</h3>
              <input value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="Project title" />
              <textarea value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Description" style={{ minHeight: '100px' }} />
              <input value={projCategory} onChange={(e) => setProjCategory(e.target.value)} placeholder="Category (e.g. Engineering)" />
              <input value={projImage} onChange={(e) => setProjImage(e.target.value)} placeholder="Image URL (optional)" />
              {projImage && <img src={sanitizeImageUrl(projImage)} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px' }} />}
              <input type="file" accept="image/*" onChange={(e) => setProjImageFile(e.target.files?.[0] || null)} />
              <button className="save alt" onClick={uploadProjectImage} disabled={projUploading}>{projUploading ? 'Uploading...' : 'Upload Image'}</button>
              <input value={projLink} onChange={(e) => setProjLink(e.target.value)} placeholder="Project Link (optional)" />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="save" onClick={saveProject}>{editingProjectId ? 'Update' : 'Save'}</button>
                {editingProjectId && <button className="save" style={{ background: '#555' }} onClick={resetProjectForm}>Cancel</button>}
              </div>
            </div>
            <div className="card">
              <h3>Project List</h3>
              {projects.map((project: any) => (
                <div key={project.id} style={{ borderBottom: '1px solid hsl(var(--border))', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <p><b>{project.title}</b> ({project.category})</p>
                    <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{project.description?.slice(0, 80)}...</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="save alt" onClick={() => startEditProject(project)}>Edit</button>
                    <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeProject(project.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PROFILE ───────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="card">
            <h3>Edit Profile</h3>
            <label style={labelStyle}>Name</label>
            <input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Name" />
            <label style={labelStyle}>Hero Badge</label>
            <input value={profileBadge} onChange={(e) => setProfileBadge(e.target.value)} placeholder="e.g. Civil Engineer" />
            <label style={labelStyle}>Professional Title / Subtitle</label>
            <input value={profileSubtitle} onChange={(e) => setProfileSubtitle(e.target.value)} placeholder="Title" />
            <label style={labelStyle}>Bio</label>
            <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} placeholder="Bio" style={{ minHeight: '150px' }} />
            <label style={labelStyle}>Profile Image URL</label>
            <input value={profileImage} onChange={(e) => setProfileImage(e.target.value)} placeholder="https://..." />
            <label style={labelStyle}>Education (short)</label>
            <input value={profileEducation} onChange={(e) => setProfileEducation(e.target.value)} placeholder="Education" />
            <label style={labelStyle}>Current Role</label>
            <input value={profileCurrentRole} onChange={(e) => setProfileCurrentRole(e.target.value)} placeholder="Current role" />
            <label style={labelStyle}>Email</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="email@example.com" />
            <label style={labelStyle}>Phone</label>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+977-XXXXXXXXXX" />
            <label style={labelStyle}>Contact Headline</label>
            <textarea value={contactHeadline} onChange={(e) => setContactHeadline(e.target.value)} placeholder="Available for new opportunities..." style={{ minHeight: '90px' }} />
            <label style={labelStyle}>LinkedIn URL</label>
            <input value={profileLinkedIn} onChange={(e) => setProfileLinkedIn(e.target.value)} placeholder="https://www.linkedin.com/in/..." />
            <label style={labelStyle}>LinkedIn Label</label>
            <input value={contactLinkedInLabel} onChange={(e) => setContactLinkedInLabel(e.target.value)} placeholder="Nayan Kuikel" />
            <label style={labelStyle}>Skills (comma separated — shown in About & Skills chips)</label>
            <input value={profileSkills} onChange={(e) => setProfileSkills(e.target.value)} placeholder="Skill 1, Skill 2, Skill 3" />
            <hr style={{ borderColor: 'hsl(var(--border))', margin: '20px 0 12px' }} />
            <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>Stat Cards</p>
            <label style={labelStyle}>First Job Year <span style={{ opacity: 0.5 }}>(auto-calculates Years Experience)</span></label>
            <input type="number" value={profileFirstJobYear} onChange={(e) => setProfileFirstJobYear(e.target.value)} placeholder="e.g. 2016" min="1980" max={new Date().getFullYear()} />
            {previewYears !== null && <p style={{ fontSize: '11px', color: 'hsl(var(--primary))', marginTop: '4px' }}>→ Will show: <b>{previewYears}+ Years Experience</b></p>}
            <label style={labelStyle}>Projects Delivered</label>
            <input type="number" value={profileProjectCount} onChange={(e) => setProfileProjectCount(e.target.value)} placeholder="e.g. 40" min="0" />
            <label style={labelStyle}>Teams Led</label>
            <input type="number" value={profileTeamsLed} onChange={(e) => setProfileTeamsLed(e.target.value)} placeholder="e.g. 12" min="0" />
            <label style={labelStyle}>Location</label>
            <input value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} placeholder="e.g. Kathmandu, Nepal" />
            <button className="save" onClick={updateProfile}>Update Profile</button>
          </div>
        )}

        {/* ── SKILLS ────────────────────────────────────────── */}
        {activeTab === 'social' && (
          <SocialLinksPanel socialLinks={socialLinks} setSocialLinks={setSocialLinks} onSave={saveSocialLinks} />
        )}

        {activeTab === 'skills' && (
          <>
            <div className="card">
              <h3>Skill Categories</h3>
              <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
                Add categories and their skills with proficiency levels (shown as progress bars on the site).
              </p>

              {/* Add new category */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="New category name (e.g. Structural Design)"
                  style={{ flex: 1 }}
                />
                <button className="save" style={{ marginTop: 0 }} onClick={addCategory}>Add Category</button>
              </div>

              {skillCategories.length === 0 && (
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '13px' }}>
                  No custom skill categories yet. Add one above, or the site will use default skills.
                </p>
              )}

              {skillCategories.map((cat, catIdx) => (
                <div key={catIdx} style={{ border: '1px solid hsl(var(--border))', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <b style={{ fontSize: '15px' }}>{cat.label}</b>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="save alt" onClick={() => setEditingCatIdx(editingCatIdx === catIdx ? null : catIdx)}>
                        {editingCatIdx === catIdx ? 'Close' : 'Edit Skills'}
                      </button>
                      <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeCategory(catIdx)}>Remove</button>
                    </div>
                  </div>

                  {/* Skills list */}
                  {cat.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>{skill.name}</span>
                      {editingCatIdx === catIdx ? (
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={skill.level}
                          onChange={(e) => updateSkillLevel(catIdx, skillIdx, parseInt(e.target.value))}
                          style={{ width: '120px' }}
                        />
                      ) : null}
                      <span style={{ fontSize: '12px', color: 'hsl(var(--primary))', minWidth: '36px', fontWeight: 700 }}>{skill.level}%</span>
                      {editingCatIdx === catIdx && (
                        <button onClick={() => removeSkill(catIdx, skillIdx)} style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '2px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>✕</button>
                      )}
                    </div>
                  ))}

                  {/* Add skill to this category */}
                  {editingCatIdx === catIdx && (
                    <div style={{ marginTop: '12px', padding: '12px', background: 'hsl(var(--background))', borderRadius: '8px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', color: 'hsl(var(--muted-foreground))' }}>Add Skill</p>
                      <input
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="Skill name"
                        style={{ marginTop: 0 }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                        <label style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>Level: {newSkillLevel}%</label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={newSkillLevel}
                          onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
                          style={{ flex: 1 }}
                        />
                      </div>
                      <button className="save" style={{ marginTop: '10px' }} onClick={() => addSkillToCategory(catIdx)}>Add Skill</button>
                    </div>
                  )}
                </div>
              ))}

              <button className="save" onClick={saveSkillCategories} style={{ marginTop: '10px' }}>
                💾 Save All Skills to Site
              </button>
            </div>
          </>
        )}

        {/* ── EDUCATION ─────────────────────────────────────── */}
        {activeTab === 'education' && (
          <>
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
                <div key={item.id} style={{ borderBottom: '1px solid hsl(var(--border))', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <p><b>{item.degree}</b> at {item.institution}</p>
                    <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{item.period}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="save alt" onClick={() => startEditEducation(item)}>Edit</button>
                    <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeEducation(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── EXPERIENCE ────────────────────────────────────── */}
        {activeTab === 'experience' && (
          <>
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
                <div key={item.id} style={{ borderBottom: '1px solid hsl(var(--border))', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <p><b>{item.role}</b> at {item.company}</p>
                    <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{item.period}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="save alt" onClick={() => startEditExperience(item)}>Edit</button>
                    <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeExperience(item.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── GALLERY ───────────────────────────────────────── */}
        {activeTab === 'gallery' && (
          <>
            <div className="card">
              <h3>Add Visual Portfolio Item</h3>
              <input value={galleryUrl} onChange={(e) => setGalleryUrl(e.target.value)} placeholder="Image URL" />
              {galleryUrl && <img src={sanitizeImageUrl(galleryUrl)} alt="Preview" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px' }} />}
              <input type="file" accept="image/*" onChange={(e) => setGalleryImageFile(e.target.files?.[0] || null)} />
              <button className="save alt" onClick={uploadGalleryImage} disabled={galleryUploading}>{galleryUploading ? 'Uploading...' : 'Upload Image'}</button>
              <select value={gallerySpan} onChange={(e) => setGallerySpan(e.target.value)}>
                <option value="col-span-1 row-span-1">Normal (1×1)</option>
                <option value="col-span-2 row-span-1">Wide (2×1)</option>
                <option value="col-span-1 row-span-2">Tall (1×2)</option>
                <option value="col-span-2 row-span-2">Large (2×2)</option>
              </select>
              <button className="save" onClick={addGalleryItem}>Add Visual</button>
            </div>
            <div className="card">
              <h3>Visual Portfolio List</h3>
              {gallery.map((item: any) => (
                <div key={item.id} style={{ borderBottom: '1px solid hsl(var(--border))', padding: '10px 0', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src={sanitizeImageUrl(item.url)} alt="Visual" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '8px' }} />
                    <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>{item.span || 'col-span-1 row-span-1'}</p>
                  </div>
                  <button className="save alt" style={{ background: '#5a2222' }} onClick={() => removeGalleryItem(item.id)}>Delete</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── THEME ─────────────────────────────────────────── */}
        {activeTab === 'theme' && (
          <>
            <div className="card">
              <h3>Mode Control</h3>
              <p style={{ marginBottom: '15px', fontSize: '13px' }}>
                Current: <b style={{ textTransform: 'uppercase', color: 'hsl(var(--primary))' }}>{mode}</b> mode · <b style={{ textTransform: 'uppercase' }}>{themeSet}</b> theme
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="save alt" onClick={() => applyMode('light')}>☀ Light</button>
                <button className="save alt" onClick={() => applyMode('dark')}>🌙 Dark</button>
                <button className="save alt" onClick={() => applyMode('brown')}>☕ Brown</button>
                <button className="save" onClick={toggleTheme}>Cycle Mode</button>
              </div>
            </div>
            <div className="card">
              <h3>Theme Sets</h3>
              <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '14px' }}>Each theme has unique colors, radius, and visual personality.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {(['architectural', 'concrete', 'luxury', 'nordic', 'precision', 'blueprint'] as ThemeSet[]).map((theme) => (
                  <button key={theme} className={`theme-chip ${themeSet === theme ? 'active' : ''}`} onClick={() => applyThemeSet(theme)}>
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── MESSAGES ──────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <div className="card">
            <h3>Messages Log</h3>
            {messages.map((m: any) => (
              <div key={m.id} style={{ borderBottom: '1px solid hsl(var(--border))', padding: '15px 0', position: 'relative' }}>
                <p><b>From: {m.name}</b> ({m.email})</p>
                <p style={{ margin: '8px 0', fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>{m.message}</p>
                <button onClick={() => deleteMessage(m.id)} style={{ position: 'absolute', top: '15px', right: '0', background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '2px 8px', cursor: 'pointer', fontSize: '10px', borderRadius: '4px' }}>Delete</button>
              </div>
            ))}
            {messages.length === 0 && <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '13px' }}>No messages yet.</p>}
          </div>
        )}

        {/* ── ADMINS ────────────────────────────────────────── */}
        {activeTab === 'admins' && (
          <>
            <div className="card">
              <h3>Grant Admin Access</h3>
              <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', marginBottom: '12px' }}>
                The user must have logged in at least once before you can grant them admin access.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="user@email.com"
                  style={{ flex: 1 }}
                />
                <button className="save" style={{ marginTop: 0 }} onClick={grantAdmin}>Grant Admin</button>
              </div>
            </div>

            <div className="card">
              <h3>All Users</h3>
              {adminLoading && <p style={{ color: 'hsl(var(--muted-foreground))' }}>Loading...</p>}
              {!adminLoading && adminUsers.length === 0 && (
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '13px' }}>No users found.</p>
              )}
              {adminUsers.map((u) => (
                <div key={u.id} style={{ borderBottom: '1px solid hsl(var(--border))', padding: '14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <b style={{ fontSize: '14px' }}>{u.email}</b>
                      {u.role === 'admin' && (
                        <span style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Admin
                        </span>
                      )}
                      {u.id === currentUser?.uid && (
                        <span style={{ fontSize: '9px', color: 'hsl(var(--muted-foreground))', fontWeight: 600, textTransform: 'uppercase' }}>
                          (You)
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: 'hsl(var(--muted-foreground))', marginTop: '2px' }}>Role: {u.role || 'user'}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {u.role !== 'admin' ? (
                      <button className="save alt" onClick={async () => {
                        await updateDoc(doc(db, 'users', u.id), { role: 'admin' });
                      }}>Grant Admin</button>
                    ) : (
                      <button
                        className="save alt"
                        style={{ background: u.id === currentUser?.uid ? '#333' : '#5a2222', cursor: u.id === currentUser?.uid ? 'not-allowed' : 'pointer' }}
                        onClick={() => revokeAdmin(u.id, u.email)}
                        disabled={u.id === currentUser?.uid}
                      >
                        Revoke Admin
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'hsl(var(--muted-foreground))',
  marginTop: '10px',
  display: 'block',
  fontWeight: 600,
};
