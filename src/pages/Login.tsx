import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../store/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Bootstrap admin role for the specific user
      if (email === 'kuikelaashutosh@gmail.com') {
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
          email: email,
          role: 'admin'
        }, { merge: true });
      }

      // Role check is handled by the useAuth listener
    } catch (err: any) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a1a1a] border border-[#333] rounded-2xl mb-6 font-black text-xl text-[#4A90D9]">NK</div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Admin Portal</h1>
          <p className="text-sm text-gray-500 mt-2">Authorized Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-[#1a1a1a] p-8 rounded-2xl border border-[#333]">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] px-4 py-3 rounded-xl text-white focus:border-[#4A90D9] outline-none transition-all"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#333] px-4 py-3 rounded-xl text-white focus:border-[#4A90D9] outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-[#4A90D9] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#3a7bc8] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:text-[#4A90D9] transition-all"
          >
            Back to Public Site
          </button>
        </div>
      </div>
    </div>
  );
}
