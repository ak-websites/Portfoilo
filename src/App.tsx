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
  const initAuth = useAuth((state) => state.init);
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
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
