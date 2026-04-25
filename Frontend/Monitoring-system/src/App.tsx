import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminFields from './pages/admin/Fields';
import AdminAgents from './pages/admin/Agents';
import AgentDashboard from './pages/agent/Dashboard';
import AgentMyFields from './pages/agent/MyFields';
import AgentFieldDetail from './pages/agent/FieldDetail';

function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function AgentRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['agent']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const getDefaultRoute = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard';
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/fields" element={<AdminRoute><AdminFields /></AdminRoute>} />
      <Route path="/admin/agents" element={<AdminRoute><AdminAgents /></AdminRoute>} />

      {/* Agent Routes */}
      <Route path="/agent/dashboard" element={<AgentRoute><AgentDashboard /></AgentRoute>} />
      <Route path="/agent/fields" element={<AgentRoute><AgentMyFields /></AgentRoute>} />
      <Route path="/agent/fields/:id" element={<AgentRoute><AgentFieldDetail /></AgentRoute>} />

      {/* Default and Wildcard */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

export default App;