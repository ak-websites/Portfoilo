import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../store/useAuth';
import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { auth } from '../lib/firebase';

export default function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass h-16 flex items-center px-4 md:px-8 justify-between">
      <Link to="/" className="flex items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold rounded-lg shadow-lg cursor-pointer"
        >
          NK
        </motion.div>
        <span className="font-bold text-xl tracking-tighter">NAYAN KUIKEL</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <a href="#about" className="hover:text-primary transition-colors">About</a>
        <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
        <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
        <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link to="/admin" title="Admin Dashboard">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <LayoutDashboard size={20} />
            </motion.div>
          </Link>
        )}
        
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm hidden sm:inline">{user.email}</span>
            <button 
              onClick={() => auth.signOut()}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <User size={18} />
            <span>Login</span>
          </Link>
        )}

        <motion.div
           initial={false}
           animate={{ opacity: 1 }}
           className="relative group ml-4"
        >
           <Link to="/admin" className="opacity-0 group-hover:opacity-100 absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-black text-white px-2 py-1 rounded">
              Only for admin
           </Link>
        </motion.div>
      </div>
    </nav>
  );
}
