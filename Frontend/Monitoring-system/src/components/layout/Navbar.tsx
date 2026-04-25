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
        <button 
          onClick={handleLogout} 
          style={logoutButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#119f29';
            e.currentTarget.style.borderColor = '#119f29';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

const navbarStyle: React.CSSProperties = {
  height: '64px',
  backgroundColor: '#16c134',
  borderBottom: '1px solid rgba(255,255,255,0.15)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  position: 'sticky',
  top: 0,
  zIndex: 50,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.35rem',
  fontWeight: 700,
  color: '#ffffff',
  letterSpacing: '-0.5px',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-md)',
};

const logoutButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: 'rgba(255,255,255,0.15)',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
};

