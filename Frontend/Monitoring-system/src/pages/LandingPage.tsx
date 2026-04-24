import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function LandingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!user;
  const dashboardRoute = isAuthenticated
    ? user.role === 'admin'
      ? '/admin/dashboard'
      : '/agent/dashboard'
    : '/login';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={landingWrapperStyle}>
      {/* Navigation Bar */}
      <nav style={navbarStyle}>
        <div style={navContainerStyle}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            SmartSeason
          </Link>

          {/* Desktop Menu */}
          <div style={desktopMenuStyle}>
            <Link
              to="/about"
              style={navLinkStyle}
            >
              About
            </Link>
            <Link
              to="/contact"
              style={navLinkStyle}
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div style={{ marginLeft: 'auto' }}>
            {isAuthenticated ? (
              <div style={authButtonsStyle}>
                <span style={userGreetingStyle}>
                  Welcome, {user.role}
                </span>
                <Link to={dashboardRoute} style={dashboardButtonStyle}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" style={getStartedButtonStyle}>
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={mobileMenuButtonStyle}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={mobileMenuStyle}>
            <Link
              to="/about"
              style={mobileNavLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              style={mobileNavLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 'var(--spacing-md)' }}>
              {isAuthenticated ? (
                <>
                  <Link to={dashboardRoute} style={mobileNavLinkStyle}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} style={mobileNavLinkStyle}>
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" style={mobileNavLinkStyle}>
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={heroBgStyle} />
        <div style={heroOverlayStyle} />
        <div style={heroContentStyle}>
          <h1 style={heroTitleStyle}>
            Smart Agricultural Field Monitoring
          </h1>
          <p style={heroSubtitleStyle}>
            Real-time monitoring, data-driven insights, and efficient farm management in one platform
          </p>
          <Link
            to={isAuthenticated ? dashboardRoute : '/login'}
            style={getStartedButtonStyle}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer 
        isAuthenticated={isAuthenticated}
        userRole={user?.role}
        dashboardRoute={dashboardRoute}
      />
    </div>
  );
}

const landingWrapperStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  backgroundColor: 'var(--color-bg)',
};

const navbarStyle = {
  position: 'sticky' as const,
  top: 0,
  zIndex: 1000,
  backgroundColor: 'var(--color-primary)',
  color: 'white' as const,
  boxShadow: 'var(--shadow-md)',
};

const navContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: 'var(--spacing-md) var(--spacing-lg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
};

const logoStyle = {
  fontSize: '1.5rem',
  fontWeight: 700,
  marginRight: 'var(--spacing-xl)',
  color: 'white' as const,
  textDecoration: 'none',
};

const desktopMenuStyle = {
  display: 'flex',
  gap: 'var(--spacing-lg)',
  flex: 1,
  '@media (max-width: 768px)': {
    display: 'none',
  },
} as React.CSSProperties;

const navLinkStyle = {
  background: 'none',
  border: 'none',
  color: 'white' as const,
  fontSize: '1rem',
  cursor: 'pointer',
  padding: 'var(--spacing-sm)',
  transition: 'opacity 0.2s',
} as React.CSSProperties;

const authButtonsStyle = {
  display: 'flex' as const,
  gap: 'var(--spacing-md)',
  alignItems: 'center' as const,
  '@media (max-width: 768px)': {
    display: 'none',
  },
} as React.CSSProperties;

const userGreetingStyle = {
  color: 'rgba(255,255,255,0.8)',
  fontSize: '0.9rem',
};

const signInButtonStyle = {
  padding: 'var(--spacing-sm) var(--spacing-md)',
  border: '2px solid white',
  borderRadius: 'var(--radius-md)',
  color: 'white' as const,
  textDecoration: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'all 0.2s',
};

const signUpButtonStyle = {
  padding: 'var(--spacing-sm) var(--spacing-md)',
  border: '2px solid var(--color-accent)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-accent)',
  color: 'white' as const,
  textDecoration: 'none',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.2s',
};

const dashboardButtonStyle = {
  padding: 'var(--spacing-sm) var(--spacing-md)',
  border: '2px solid var(--color-accent)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-accent)',
  color: 'white' as const,
  textDecoration: 'none',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.2s',
};

const logoutButtonStyle = {
  padding: 'var(--spacing-sm) var(--spacing-md)',
  border: '2px solid white',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'transparent',
  color: 'white' as const,
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'all 0.2s',
};

const mobileMenuButtonStyle = {
  background: 'none',
  border: 'none',
  color: 'white' as const,
  fontSize: '1.5rem',
  cursor: 'pointer',
  padding: 'var(--spacing-sm)',
  display: 'none',
  '@media (max-width: 768px)': {
    display: 'block',
  },
} as React.CSSProperties;

const mobileMenuStyle = {
  display: 'flex' as const,
  flexDirection: 'column' as const,
  gap: 'var(--spacing-md)',
  padding: 'var(--spacing-md) var(--spacing-lg)',
  backgroundColor: 'rgba(45, 80, 22, 0.95)',
  width: '100%',
};

const mobileNavLinkStyle = {
  background: 'none',
  border: 'none',
  color: 'white' as const,
  textAlign: 'left' as const,
  fontSize: '1rem',
  cursor: 'pointer',
  padding: 'var(--spacing-sm)',
  textDecoration: 'none',
};

const heroStyle = {
  position: 'relative' as const,
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  textAlign: 'center' as const,
  overflow: 'hidden',
  color: 'white' as const,
};

const heroBgStyle = {
  position: 'absolute' as const,
  inset: 0,
  backgroundImage: "url('/Background.png')",
  backgroundSize: 'cover' as const,
  backgroundPosition: 'center' as const,
  backgroundRepeat: 'no-repeat' as const,
  zIndex: 0,
};

const heroOverlayStyle = {
  position: 'absolute' as const,
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  zIndex: 1,
};

const heroContentStyle = {
  position: 'relative' as const,
  zIndex: 2,
  maxWidth: '800px',
  padding: 'var(--spacing-lg)',
  animation: 'fadeInUp 0.8s ease',
};

const heroTitleStyle = {
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: 700,
  marginBottom: 'var(--spacing-md)',
  lineHeight: 1.2,
  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
};

const heroSubtitleStyle = {
  fontSize: 'clamp(1rem, 3vw, 1.25rem)',
  marginBottom: 'var(--spacing-lg)',
  opacity: 0.95,
  lineHeight: 1.6,
  textShadow: '0 1px 5px rgba(0,0,0,0.5)',
};

const getStartedButtonStyle = {
  display: 'inline-block',
  padding: 'var(--spacing-md) var(--spacing-lg)',
  paddingRight: 'calc(var(--spacing-lg) + 8px)',
  backgroundColor: 'var(--color-accent)',
  color: 'white' as const,
  textDecoration: 'none',
  borderRadius: 'var(--radius-lg)',
  fontSize: '1.1rem',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(139, 105, 20, 0.4)',
  cursor: 'pointer',
};

const sectionContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};
