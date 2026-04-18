import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './store/useAuth';
import { useTheme } from './store/useTheme';
import { useContent } from './store/useContent';

// Pages
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const initAuth = useAuth((state) => state.initialize);
  const syncTheme = useTheme((state) => state.syncWithFirestore);
  const syncContent = useContent((state) => state.syncContent);

  useEffect(() => {
    const unsubAuth = initAuth();
    const unsubTheme = syncTheme();
    const unsubContent = syncContent();

    return () => {
      unsubAuth();
      unsubTheme();
      unsubContent();
    };
  }, [initAuth, syncTheme, syncContent]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Main Portfolio Layout */}
          <Route path="/" element={<><Navbar /><main className="flex-grow"><Home /></main><Footer /></>} />
          <Route path="/login" element={<main className="flex-grow"><Login /></main>} />
          
          {/* Separate Admin Dashboard Layout (No Site Navbar/Footer) */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
