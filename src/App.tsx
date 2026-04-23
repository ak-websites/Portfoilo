import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './store/useAuth';
import { useTheme } from './store/useTheme';
import { useContent } from './store/useContent';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

function AppShell() {
  const location = useLocation();
  const initAuth = useAuth((state) => state.initialize);
  const syncTheme = useTheme((state) => state.syncWithFirestore);
  const fetchContent = useContent((state) => state.fetchContent);
  const syncContent = useContent((state) => state.syncContent);

  useEffect(() => {
    const unsubAuth = initAuth();
    const unsubTheme = syncTheme();

    return () => {
      unsubAuth();
      unsubTheme();
    };
  }, [initAuth, syncTheme]);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      const unsubContent = syncContent();
      return () => unsubContent();
    }

    void fetchContent();
    return undefined;
  }, [location.pathname, fetchContent, syncContent]);

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<><Navbar /><main className="flex-grow"><Home /></main><Footer /></>} />
          <Route path="/login" element={<main className="flex-grow"><Login /></main>} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>
  );
}

export default App;
