import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '220px',
        backgroundColor: 'var(--color-primary)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--spacing-md)',
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'white',
          }}
        >
          SmartSeason
        </h1>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', flex: 1 }}>
        <Link
          to="/"
          style={linkStyle}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={linkStyle}
        >
          About
        </Link>
        <Link
          to="/features"
          style={linkStyle}
        >
          Features
        </Link>
        <Link
          to="/problem-solution"
          style={linkStyle}
        >
          Problem & Solution
        </Link>
        <Link
          to="/tech-stack"
          style={linkStyle}
        >
          Tech Stack
        </Link>
        {isAuthenticated && (
          <>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: 'var(--spacing-sm) 0' }} />
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Logged in as {user.role}
            </p>
          </>
        )}
      </nav>

      {/* Auth section */}
      <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        {isAuthenticated ? (
          <>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Logged in as {user.role}
            </p>
            <Link
              to="/login"
              style={{
                ...linkStyle,
                marginTop: 'var(--spacing-xs)',
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <Link
            to="/login"
            style={linkStyle}
          >
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: 'var(--spacing-sm)',
  borderRadius: 'var(--radius-md)',
  display: 'block',
  fontSize: '0.9375rem',
  transition: 'background 0.2s',
} as const;