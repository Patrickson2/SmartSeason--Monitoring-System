import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Fields from './pages/admin/Fields';
import FieldDetail from './pages/admin/FieldDetail';
import Agents from './pages/admin/Agents';
import AgentDashboard from './pages/agent/Dashboard';
import MyFields from './pages/agent/MyFields';
import AgentFieldDetail from './pages/agent/FieldDetail';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fields"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Fields />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fields/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FieldDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Agents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-fields"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <MyFields />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-fields/:id"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentFieldDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent-dashboard"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;