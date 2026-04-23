import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
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
            <button
              onClick={() => scrollToSection('about')}
              style={navLinkStyle}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              style={navLinkStyle}
            >
              Contact
            </button>
          </div>

          {/* Auth Buttons */}
          <div style={authButtonsStyle}>
            {isAuthenticated ? (
              <>
                <span style={userGreetingStyle}>
                  Welcome, {user.role}
                </span>
                <Link to={dashboardRoute} style={dashboardButtonStyle}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} style={logoutButtonStyle}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={signInButtonStyle}>
                  Sign In
                </Link>
                <Link to="/login" style={signUpButtonStyle}>
                  Sign Up
                </Link>
              </>
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
            <button
              onClick={() => scrollToSection('about')}
              style={mobileNavLinkStyle}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              style={mobileNavLinkStyle}
            >
              Contact
            </button>
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
                <>
                  <Link to="/login" style={mobileNavLinkStyle}>
                    Sign In
                  </Link>
                  <Link to="/login" style={mobileNavLinkStyle}>
                    Sign Up
                  </Link>
                </>
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

      {/* About Section */}
      <section id="about" style={aboutSectionStyle}>
        <div style={sectionContainerStyle}>
          <h2 style={sectionTitleStyle}>About SmartSeason</h2>
          <div style={aboutContentStyle}>
            <div style={aboutCardStyle}>
              <div style={aboutIconStyle}>🌾</div>
              <h3 style={aboutCardTitleStyle}>Real-time Monitoring</h3>
              <p style={aboutCardTextStyle}>
                Track crop growth stages and field conditions with live updates. Get instant notifications when important changes occur in your fields.
              </p>
            </div>
            <div style={aboutCardStyle}>
              <div style={aboutIconStyle}>📊</div>
              <h3 style={aboutCardTitleStyle}>Data-Driven Insights</h3>
              <p style={aboutCardTextStyle}>
                Make informed decisions with comprehensive analytics and historical field data. Optimize your farming strategies based on real insights.
              </p>
            </div>
            <div style={aboutCardStyle}>
              <div style={aboutIconStyle}>🔒</div>
              <h3 style={aboutCardTitleStyle}>Secure & Reliable</h3>
              <p style={aboutCardTextStyle}>
                Enterprise-grade security with role-based access control. Separate interfaces for administrators and field agents ensuring data integrity.
              </p>
            </div>
          </div>
          <div style={aboutDescriptionStyle}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Why Choose SmartSeason?</h3>
            <p style={{ lineHeight: 1.8, marginBottom: 'var(--spacing-md)' }}>
              SmartSeason transforms agricultural field management by digitizing manual processes. Traditional agriculture relies on time-consuming inspections and paper-based records, leading to inefficiencies and missed opportunities. Our platform automates field monitoring, provides real-time updates, and delivers actionable insights to help you optimize crop management and increase farm productivity.
            </p>
            <p style={{ lineHeight: 1.8 }}>
              Whether you manage a single field or hundreds of acres, SmartSeason scales with your operations. Reduce operational costs, improve crop yields, and make faster decisions with comprehensive data visibility.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={contactSectionStyle}>
        <div style={sectionContainerStyle}>
          <h2 style={sectionTitleStyle}>Get In Touch</h2>
          <div style={contactContentStyle}>
            <div style={contactCardStyle}>
              <div style={contactIconStyle}>📧</div>
              <h3>Email</h3>
              <p>support@smartseason.com</p>
            </div>
            <div style={contactCardStyle}>
              <div style={contactIconStyle}>🌐</div>
              <h3>Website</h3>
              <p>www.smartseason.com</p>
            </div>
            <div style={contactCardStyle}>
              <div style={contactIconStyle}>📱</div>
              <h3>Support</h3>
              <p>Available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={sectionContainerStyle}>
          <div style={footerContentStyle}>
            <div>
              <h4 style={{ margin: '0 0 var(--spacing-md)' }}>SmartSeason</h4>
              <p style={{ margin: 0, opacity: 0.8 }}>Agricultural Field Monitoring System</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 var(--spacing-md)' }}>Quick Links</h4>
              <button onClick={() => scrollToSection('about')} style={footerLinkStyle}>About</button>
              <button onClick={() => scrollToSection('contact')} style={footerLinkStyle}>Contact</button>
              {isAuthenticated && (
                <Link to={dashboardRoute} style={footerLinkStyle}>Dashboard</Link>
              )}
            </div>
          </div>
          <div style={footerBottomStyle}>
            <p style={{ margin: 0 }}>© 2026 SmartSeason. All rights reserved.</p>
          </div>
        </div>
      </footer>
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
  color: 'white' as const,
  textDecoration: 'none',
  marginRight: 'var(--spacing-lg)',
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

const aboutSectionStyle = {
  padding: 'var(--spacing-xl) var(--spacing-lg)',
  backgroundColor: 'var(--color-bg)',
};

const contactSectionStyle = {
  padding: 'var(--spacing-xl) var(--spacing-lg)',
  backgroundColor: 'var(--color-surface)',
  borderTop: '1px solid var(--color-border)',
};

const sectionContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const sectionTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 700,
  textAlign: 'center' as const,
  marginBottom: 'var(--spacing-xl)',
  color: 'var(--color-text)',
};

const aboutContentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 'var(--spacing-lg)',
  marginBottom: 'var(--spacing-xl)',
};

const aboutCardStyle = {
  backgroundColor: 'var(--color-surface)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  textAlign: 'center' as const,
  border: '1px solid var(--color-border)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const aboutIconStyle = {
  fontSize: '3rem',
  marginBottom: 'var(--spacing-md)',
};

const aboutCardTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: 'var(--spacing-md)',
  color: 'var(--color-primary)',
};

const aboutCardTextStyle = {
  color: 'var(--color-text-muted)',
  lineHeight: 1.6,
  margin: 0,
};

const aboutDescriptionStyle = {
  backgroundColor: 'var(--color-surface)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text)',
};

const contactContentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: 'var(--spacing-lg)',
};

const contactCardStyle = {
  backgroundColor: 'var(--color-bg)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',
  textAlign: 'center' as const,
  border: '1px solid var(--color-border)',
};

const contactIconStyle = {
  fontSize: '2.5rem',
  marginBottom: 'var(--spacing-md)',
};

const footerStyle = {
  marginTop: 'auto',
  backgroundColor: 'var(--color-primary)',
  color: 'white' as const,
  padding: 'var(--spacing-xl) var(--spacing-lg)',
  borderTop: '1px solid var(--color-border)',
};

const footerContentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 'var(--spacing-xl)',
  marginBottom: 'var(--spacing-lg)',
  paddingBottom: 'var(--spacing-lg)',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};

const footerLinkStyle = {
  display: 'block',
  color: 'rgba(255,255,255,0.8)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  margin: 'var(--spacing-sm) 0',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'color 0.2s',
};

const footerBottomStyle = {
  textAlign: 'center' as const,
  opacity: 0.7,
  fontSize: '0.875rem',
};