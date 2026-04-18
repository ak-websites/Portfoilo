import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
  init: () => () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  setUser: (user) => set({ user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (loading) => set({ loading }),
  init: () => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      set({ user, loading: true });
      if (user) {
        const adminDoc = await getDoc(doc(db, 'admins', user.email || ''));
        set({ isAdmin: adminDoc.exists(), loading: false });
      } else {
        set({ isAdmin: false, loading: false });
      }
    });
    return unsub;
  },
}));
