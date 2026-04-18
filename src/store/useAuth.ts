import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authLoading: boolean; // For the redirect logic
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  authLoading: true,
  setUser: (user) => set({ user }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (loading) => set({ loading, authLoading: loading }),
  initialize: () => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      set({ user, loading: true, authLoading: true });
      
      if (user) {
        // Special bootstrap for the specific user
        if (user.email === 'kuikelaashutosh@gmail.com') {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, { email: user.email, role: 'admin' }, { merge: true });
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        set({ 
          isAdmin: userData?.role === 'admin',
          loading: false,
          authLoading: false
        });
      } else {
        set({ isAdmin: false, loading: false, authLoading: false });
      }
    });

    return unsub;
  },
}));
