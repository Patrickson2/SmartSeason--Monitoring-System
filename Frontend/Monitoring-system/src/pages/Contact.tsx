import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function Contact() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
  };

  // Styles matching LandingPage
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
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'opacity 0.2s',
  };

  const getStartedButtonStyle = {
    backgroundColor: 'white',
    color: '#2d5016',
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'all 0.2s',
  };

  const mobileMenuButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: 'var(--spacing-xs)',
  };

  const mobileMenuStyle = {
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'block',
      backgroundColor: 'var(--color-primary)',
      padding: 'var(--spacing-md)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
    },
  } as React.CSSProperties;

  const mobileNavLinkStyle = {
    display: 'block',
    color: 'white',
    textDecoration: 'none',
    padding: 'var(--spacing-sm) 0',
    fontSize: '1rem',
  };

  const sectionContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'var(--spacing-xl) var(--spacing-lg)',
  };

  const contactSectionStyle = {
    flex: 1,
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, rgba(45, 80, 22, 0.05) 0%, rgba(111, 181, 132, 0.1) 100%)',
  };

  const contactTitleStyle = {
    fontSize: '3rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  };

  const contactIntroStyle = {
    fontSize: '1.3rem',
    color: 'var(--color-text)',
    textAlign: 'center' as const,
    marginBottom: '3rem',
    opacity: 0.8,
  };

  const contactCardsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem',
  };

  const contactCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    textAlign: 'center' as const,
    transition: 'transform 0.3s ease',
  };

  const contactIconStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
    marginBottom: '1rem',
  };

  const contactCardTitleStyle = {
    fontSize: '1.25rem',
    color: 'var(--color-primary)',
    marginBottom: '0.5rem',
  };

  const contactTextStyle = {
    color: 'var(--color-text)',
    lineHeight: 1.6,
    marginBottom: '0.5rem',
  };

  const contactNoteStyle = {
    color: 'var(--color-text-muted)',
    fontSize: '0.9rem',
  };

  const formSectionStyle = {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    maxWidth: '600px',
    margin: '0 auto',
  };

  const formTitleStyle = {
    fontSize: '2rem',
    color: 'var(--color-primary)',
    marginBottom: '2rem',
    textAlign: 'center' as const,
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const labelStyle = {
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--color-text)',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    padding: 'var(--spacing-sm) var(--spacing-md)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '1rem',
    backgroundColor: 'var(--color-bg)',
    color: 'var(--color-text)',
    transition: 'border-color 0.2s',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical' as const,
    minHeight: '120px',
  };

  const submitButtonStyle = {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: 'var(--spacing-md)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const footerStyle = {
    backgroundColor: '#2d5016',
    color: 'white',
    padding: '2rem 0',
  };

  const footerBottomStyle = {
    textAlign: 'center' as const,
    paddingTop: 'var(--spacing-md)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
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
            <Link to="/" style={navLinkStyle}>
              Home
            </Link>
            <Link to="/about" style={navLinkStyle}>
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div style={{ marginLeft: 'auto' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                <span style={{ color: 'white', marginRight: 'var(--spacing-sm)' }}>
                  Welcome, {user.role}
                </span>
                <Link to={dashboardRoute} style={getStartedButtonStyle}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} style={{ ...getStartedButtonStyle, background: 'transparent', color: 'white' }}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" style={getStartedButtonStyle}>
                Get Started
              </Link>
            )}
          </div>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={mobileMenuStyle}>
            <Link
              to="/"
              style={mobileNavLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              style={mobileNavLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
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

      {/* Contact Content */}
      <section style={contactSectionStyle}>
        <div style={sectionContainerStyle}>
          <h1 style={contactTitleStyle}>Get In Touch</h1>
          <p style={contactIntroStyle}>
            We're here to help and answer any question you might have
          </p>

          <div style={contactCardsStyle}>
            <div style={contactCardStyle}>
              <div style={contactIconStyle}>Email</div>
              <h3 style={contactCardTitleStyle}>Email Us</h3>
              <p style={contactTextStyle}>support@smartseason.com</p>
              <p style={contactNoteStyle}>For support inquiries and general questions</p>
            </div>

            <div style={contactCardStyle}>
              <div style={contactIconStyle}>Web</div>
              <h3 style={contactCardTitleStyle}>Website</h3>
              <p style={contactTextStyle}>www.smartseason.com</p>
              <p style={contactNoteStyle}>Visit our website for more information</p>
            </div>

            <div style={contactCardStyle}>
              <div style={contactIconStyle}>Support</div>
              <h3 style={contactCardTitleStyle}>Support</h3>
              <p style={contactTextStyle}>Available 24/7</p>
              <p style={contactNoteStyle}>We're always here when you need us</p>
            </div>
          </div>

          <div style={formSectionStyle}>
            <h2 style={formTitleStyle}>Send us a Message</h2>
            <form style={formStyle} onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="What is this about?"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  placeholder="Your message..."
                  rows={6}
                  required
                  style={textareaStyle}
                />
              </div>

              <button type="submit" style={submitButtonStyle}>
                Send Message
              </button>
            </form>
          </div>
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
