import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
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
      await login(response.access_token, response.user_role as 'admin');

      if (response.user_role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('This page is for administrators only');
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
          <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>SmartSeason Admin</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-sm)' }}>Administrator Access Only</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Default admin: admin@smartseason.com / Admin123!
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e as any)}>
          {error && <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', marginBottom: 'var(--spacing-md)', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>{error}</div>}

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
              autoComplete="email"
              style={{ width: '100%', padding: 'var(--spacing-sm) var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoComplete="current-password"
              style={{ width: '100%', padding: 'var(--spacing-sm) var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              marginTop: 'var(--spacing-sm)'
            }}
          >
            {isLoading ? 'Signing in...' : 'Admin Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>
            For agent registration, use the main login page
          </p>
        </div>
      </div>
    </div>
  );
}