import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/useAuth';
import { LogOut, LayoutDashboard, User, Menu, X, Sun, Moon, Coffee } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { useState } from 'react';
import { useTheme } from '../store/useTheme';
import { doc, setDoc } from 'firebase/firestore';

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const { mode, setMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const toggleMode = async () => {
    const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'brown' : 'light';
    
    // Update local state immediately
    setMode(nextMode);
    
    // If admin, update globally in Firestore
    if (isAdmin) {
      try {
        await setDoc(doc(db, 'settings', 'global'), { mode: nextMode }, { merge: true });
      } catch (error) {
        console.error("Failed to update global theme:", error);
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-20 flex items-center px-6 md:px-12 justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 group relative cursor-pointer" onClick={handleAdminClick}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center font-black rounded-xl shadow-xl transition-all"
          >
            NK
          </motion.div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter leading-none uppercase tracking-widest">Nayan Kuikel</span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-primary/60 font-black">Authorized_Access</span>
          </div>
          
          <div className="absolute -bottom-12 left-0 opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0">
            <span className="bg-destructive text-destructive-foreground text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg">
              Authorized Personnel Only
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
          <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleMode}
          className="p-3 rounded-xl bg-accent hover:bg-accent/80 transition-all flex items-center justify-center border border-border"
          title={`Switch to ${mode === 'light' ? 'Dark' : mode === 'dark' ? 'Brown' : 'Light'} Mode`}
        >
          {mode === 'light' && <Sun size={20} />}
          {mode === 'dark' && <Moon size={20} />}
          {mode === 'brown' && <Coffee size={20} />}
        </button>

        <div className="hidden md:flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2 text-xs font-black uppercase bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">
              <LayoutDashboard size={14} />
              Dashboard
            </Link>
          )}
          
          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold leading-none">{user.email?.split('@')[0]}</span>
                <span className="text-[10px] text-muted-foreground uppercase">Logged In</span>
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="p-2.5 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors border border-transparent hover:border-destructive/20"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-xs font-bold uppercase bg-foreground text-background px-6 py-2.5 rounded-full hover:scale-105 transition-transform">
              <User size={14} />
              Login
            </Link>
          )}
        </div>

        <button 
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 glass rounded-3xl p-8 flex flex-col gap-6 lg:hidden shadow-2xl"
          >
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black">About</a>
            <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black">Experience</a>
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black">Projects</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black">Contact</a>
            <hr className="border-border" />
            {!user && (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-primary">Login</Link>
            )}
            {user && (
               <button onClick={() => auth.signOut()} className="text-2xl font-black text-destructive text-left">Logout</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
