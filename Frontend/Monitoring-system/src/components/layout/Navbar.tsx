import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={navbarStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={actionsStyle}>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </header>
  );
}

const navbarStyle: React.CSSProperties = {
  height: '64px',
  backgroundColor: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 var(--spacing-xl)',
  position: 'sticky',
  top: 0,
  zIndex: 50,
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--color-text)',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-md)',
};

const logoutButtonStyle: React.CSSProperties = {
  padding: 'var(--spacing-sm) var(--spacing-md)',
  backgroundColor: 'transparent',
  color: 'var(--color-text)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
};