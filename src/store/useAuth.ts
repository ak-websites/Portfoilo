import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';

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
        try {
          // Check if specific email is in admins collection
          const adminDoc = await getDoc(doc(db, 'admins', user.email || ''));
          let isAdmin = adminDoc.exists();

          // Fallback: If no admins exist yet, allow the first user (bootstrap)
          if (!isAdmin) {
            const adminsRef = collection(db, 'admins');
            const adminSnapshot = await getDocs(query(adminsRef, limit(1)));
            if (adminSnapshot.empty) {
              isAdmin = true;
            }
          }

          set({ isAdmin, loading: false });
        } catch (error) {
          console.error("Auth init error:", error);
          set({ isAdmin: false, loading: false });
        }
      } else {
        set({ isAdmin: false, loading: false });
      }
    });
    return unsub;
  },
}));
