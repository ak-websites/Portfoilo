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

  const toggleMode = async () => {
    const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'brown' : 'light';
    setMode(nextMode);
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
        {/* Logo - no more AUTHORIZED_ACCESS */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -8, 8, 0] }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.3 }}
            className="w-11 h-11 bg-primary text-primary-foreground flex items-center justify-center font-black rounded-xl shadow-lg text-sm"
          >
            NK
          </motion.div>
          <span className="font-black text-lg tracking-tight uppercase hidden sm:block">Nayan Kuikel</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <a href="#about" className="hover:text-primary transition-colors duration-200">About</a>
          <a href="#experience" className="hover:text-primary transition-colors duration-200">Experience</a>
          <a href="#projects" className="hover:text-primary transition-colors duration-200">Projects</a>
          <a href="#contact" className="hover:text-primary transition-colors duration-200">Contact</a>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleMode}
          className="p-2.5 rounded-xl bg-accent hover:bg-accent/80 transition-all flex items-center justify-center border border-border"
          title={`Switch to ${mode === 'light' ? 'Dark' : mode === 'dark' ? 'Brown' : 'Light'} Mode`}
        >
          {mode === 'light' && <Sun size={18} />}
          {mode === 'dark' && <Moon size={18} />}
          {mode === 'brown' && <Coffee size={18} />}
        </button>

        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2 text-xs font-black uppercase bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-all border border-primary/20">
              <LayoutDashboard size={13} />
              Dashboard
            </Link>
          )}
          
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold leading-none">{user.email?.split('@')[0]}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Online</span>
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="p-2 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors border border-transparent hover:border-destructive/20"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-xs font-bold uppercase bg-foreground text-background px-5 py-2.5 rounded-full hover:scale-105 transition-transform">
              <User size={13} />
              Login
            </Link>
          )}
        </div>

        <button 
          className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 left-6 right-6 glass rounded-3xl p-8 flex flex-col gap-5 lg:hidden shadow-2xl"
          >
            {['about', 'experience', 'projects', 'contact'].map((section) => (
              <a 
                key={section}
                href={`#${section}`} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-xl font-black uppercase tracking-wider capitalize hover:text-primary transition-colors"
              >
                {section}
              </a>
            ))}
            <hr className="border-border" />
            {!user && (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-primary">Login</Link>
            )}
            {user && (
              <button onClick={() => auth.signOut()} className="text-xl font-black text-destructive text-left">Logout</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
