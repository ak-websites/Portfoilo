import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, getDoc, getDocs, onSnapshot, orderBy, query, doc } from 'firebase/firestore';

interface ContentState {
  hero: any;
  about: any;
  contact: any;
  projects: any[];
  education: any[];
  experience: any[];
  gallery: any[];
  setHero: (hero: any) => void;
  setAbout: (about: any) => void;
  setContact: (contact: any) => void;
  setProjects: (projects: any[]) => void;
  setEducation: (education: any[]) => void;
  setExperience: (experience: any[]) => void;
  setGallery: (gallery: any[]) => void;
  fetchContent: () => Promise<void>;
  syncContent: () => () => void;
}

export const useContent = create<ContentState>((set) => ({
  hero: null,
  about: null,
  contact: null,
  projects: [],
  education: [],
  experience: [],
  gallery: [],
  setHero: (hero) => set({ hero }),
  setAbout: (about) => set({ about }),
  setContact: (contact) => set({ contact }),
  setProjects: (projects) => set({ projects }),
  setEducation: (education) => set({ education }),
  setExperience: (experience) => set({ experience }),
  setGallery: (gallery) => set({ gallery }),
  fetchContent: async () => {
    const [heroDoc, aboutDoc, contactDoc, projectsSnap, educationSnap, experienceSnap, gallerySnap] = await Promise.all([
      getDoc(doc(db, 'content', 'hero')),
      getDoc(doc(db, 'content', 'about')),
      getDoc(doc(db, 'content', 'contact')),
      getDocs(query(collection(db, 'projects'), orderBy('order', 'asc'))),
      getDocs(query(collection(db, 'education'), orderBy('order', 'desc'))),
      getDocs(query(collection(db, 'experience'), orderBy('order', 'desc'))),
      getDocs(query(collection(db, 'gallery'), orderBy('order', 'asc'))),
    ]);

    set({
      hero: heroDoc.data() || null,
      about: aboutDoc.data() || null,
      contact: contactDoc.data() || null,
      projects: projectsSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      education: educationSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      experience: experienceSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
      gallery: gallerySnap.docs.map((d) => ({ id: d.id, ...d.data() })),
    });
  },
  syncContent: () => {
    const unsubs = [
      onSnapshot(doc(db, 'content', 'hero'), (d) => set({ hero: d.data() })),
      onSnapshot(doc(db, 'content', 'about'), (d) => set({ about: d.data() })),
      onSnapshot(doc(db, 'content', 'contact'), (d) => set({ contact: d.data() })),
      onSnapshot(query(collection(db, 'projects'), orderBy('order', 'asc')), (s) => 
        set({ projects: s.docs.map(d => ({ id: d.id, ...d.data() })) })
      ),
      onSnapshot(query(collection(db, 'education'), orderBy('order', 'desc')), (s) =>
        set({ education: s.docs.map(d => ({ id: d.id, ...d.data() })) })
      ),
      onSnapshot(query(collection(db, 'experience'), orderBy('order', 'desc')), (s) => 
        set({ experience: s.docs.map(d => ({ id: d.id, ...d.data() })) })
      ),
      onSnapshot(query(collection(db, 'gallery'), orderBy('order', 'asc')), (s) => 
        set({ gallery: s.docs.map(d => ({ id: d.id, ...d.data() })) })
      ),
    ];
    return () => unsubs.forEach(unsub => unsub());
  },
}));
