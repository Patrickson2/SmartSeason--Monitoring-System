import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/fields', label: 'Fields' },
  { to: '/admin/agents', label: 'Agents' },
  { to: '/admin/updates', label: 'Updates' },
];

const agentLinks = [
  { to: '/agent/dashboard', label: 'Dashboard' },
  { to: '/agent/fields', label: 'My Fields' },
];

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === 'admin' ? adminLinks : agentLinks;

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={logoStyle}>
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>SmartSeason</h1>
      </div>

      {/* Navigation */}
      <nav style={navStyle}>
        {links?.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...navLinkStyle,
              ...(isActive ? navLinkActiveStyle : {}),
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div style={userInfoStyle}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
          Logged in as
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem', textTransform: 'capitalize' }}>
          {user?.role}
        </p>
      </div>
    </aside>
  );
}

const sidebarStyle: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: '220px',
  backgroundColor: 'var(--color-primary)',
  display: 'flex',
  flexDirection: 'column',
  padding: 'var(--spacing-md)',
  zIndex: 100,
};

const logoStyle: React.CSSProperties = {
  padding: 'var(--spacing-md) 0',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
  marginBottom: 'var(--spacing-md)',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-xs)',
  flex: 1,
};

const navLinkStyle: React.CSSProperties = {
  display: 'block',
  padding: 'var(--spacing-sm) var(--spacing-md)',
  color: 'white',
  textDecoration: 'none',
  borderRadius: 'var(--radius-md)',
  fontSize: '0.9375rem',
  transition: 'background-color 0.2s ease',
};

const navLinkActiveStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-primary-light)',
};

const userInfoStyle: React.CSSProperties = {
  padding: 'var(--spacing-md) 0',
  borderTop: '1px solid rgba(255,255,255,0.2)',
  marginTop: 'var(--spacing-md)',
};