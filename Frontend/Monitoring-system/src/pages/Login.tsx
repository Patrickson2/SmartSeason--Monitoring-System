import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      await login(response.access_token, response.user_role as UserRole);

      if (response.user_role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/agent/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg)', padding: 'var(--spacing-md)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: 'var(--spacing-xl)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>SmartSeason</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        <form onSubmit={(e) => handleSubmit(e as any)}>
          {error && <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', marginBottom: 'var(--spacing-md)', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: 'var(--spacing-sm)' }}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}