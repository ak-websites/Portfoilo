import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';

interface ContentState {
  hero: any;
  about: any;
  contact: any;
  projects: any[];
  experience: any[];
  gallery: any[];
  setHero: (hero: any) => void;
  setAbout: (about: any) => void;
  setContact: (contact: any) => void;
  setProjects: (projects: any[]) => void;
  setExperience: (experience: any[]) => void;
  setGallery: (gallery: any[]) => void;
  syncContent: () => () => void;
}

export const useContent = create<ContentState>((set) => ({
  hero: null,
  about: null,
  contact: null,
  projects: [],
  experience: [],
  gallery: [],
  setHero: (hero) => set({ hero }),
  setAbout: (about) => set({ about }),
  setContact: (contact) => set({ contact }),
  setProjects: (projects) => set({ projects }),
  setExperience: (experience) => set({ experience }),
  setGallery: (gallery) => set({ gallery }),
  syncContent: () => {
    const unsubs = [
      onSnapshot(doc(db, 'content', 'hero'), (d) => set({ hero: d.data() })),
      onSnapshot(doc(db, 'content', 'about'), (d) => set({ about: d.data() })),
      onSnapshot(doc(db, 'content', 'contact'), (d) => set({ contact: d.data() })),
      onSnapshot(query(collection(db, 'projects'), orderBy('order', 'asc')), (s) => 
        set({ projects: s.docs.map(d => ({ id: d.id, ...d.data() })) })
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
