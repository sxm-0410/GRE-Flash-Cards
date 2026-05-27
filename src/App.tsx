import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DailyChallenge } from './components/DailyChallenge';
import { WordLists } from './components/WordLists';
import { useAuth } from './components/AuthProvider';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Practice } from './pages/Practice';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to={`/auth?redirectTo=${encodeURIComponent(location.pathname)}`} />;
  }
  
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/challenge" element={
          <ProtectedRoute>
            <DailyChallenge />
          </ProtectedRoute>
        } />

        <Route path="/practice" element={
          <ProtectedRoute>
            <Practice />
          </ProtectedRoute>
        } />
        
        {/* Word Lists is partially public but wrapped in Layout */}
        <Route path="/lists" element={
          <Layout>
            <WordLists />
          </Layout>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
