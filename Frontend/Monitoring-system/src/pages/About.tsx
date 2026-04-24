import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

export default function About() {
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

  const aboutSectionStyle = {
    flex: 1,
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, rgba(45, 80, 22, 0.05) 0%, rgba(111, 181, 132, 0.1) 100%)',
  };

  const aboutTitleStyle = {
    fontSize: '3rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    marginBottom: '1rem',
    textAlign: 'center' as const,
  };

  const aboutIntroStyle = {
    fontSize: '1.3rem',
    color: 'var(--color-text)',
    textAlign: 'center' as const,
    marginBottom: '3rem',
    opacity: 0.8,
  };

  const featuresStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem',
  };

  const featureCardStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    textAlign: 'center' as const,
    transition: 'transform 0.3s ease',
  };

  const featureIconStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
    marginBottom: '1rem',
  };

  const featureTitleStyle = {
    fontSize: '1.25rem',
    color: 'var(--color-primary)',
    marginBottom: '0.5rem',
  };

  const featureDescriptionStyle = {
    color: 'var(--color-text)',
    lineHeight: 1.6,
  };

  const contentSectionStyle = {
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '2rem',
    boxShadow: 'var(--shadow-md)',
  };

  const contentTitleStyle = {
    fontSize: '2rem',
    color: 'var(--color-primary)',
    marginBottom: '1.5rem',
  };

  const contentTextStyle = {
    color: 'var(--color-text)',
    lineHeight: 1.8,
    marginBottom: '1.5rem',
    fontSize: '1.05rem',
  };

  const benefitsListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const benefitItemStyle = {
    padding: '1rem',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderLeft: '4px solid var(--color-primary)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text)',
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
            <Link to="/contact" style={navLinkStyle}>
              Contact
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

      {/* About Content */}
      <section style={aboutSectionStyle}>
        <div style={sectionContainerStyle}>
          <h1 style={aboutTitleStyle}>About SmartSeason</h1>
          <p style={aboutIntroStyle}>
            Transforming agricultural field management through technology
          </p>

          <div style={featuresStyle}>
            <div style={featureCardStyle}>
              <div style={featureIconStyle}>Monitor</div>
              <h3 style={featureTitleStyle}>Real-time Monitoring</h3>
              <p style={featureDescriptionStyle}>
                Track crop growth stages and field conditions with live updates. Get instant notifications when important changes occur in your fields.
              </p>
            </div>
            <div style={featureCardStyle}>
              <div style={featureIconStyle}>Analytics</div>
              <h3 style={featureTitleStyle}>Data-Driven Insights</h3>
              <p style={featureDescriptionStyle}>
                Make informed decisions with comprehensive analytics and historical field data. Optimize your farming strategies based on real insights.
              </p>
            </div>
            <div style={featureCardStyle}>
              <div style={featureIconStyle}>Security</div>
              <h3 style={featureTitleStyle}>Secure & Reliable</h3>
              <p style={featureDescriptionStyle}>
                Enterprise-grade security with role-based access control. Separate interfaces for administrators and field agents ensuring data integrity.
              </p>
            </div>
          </div>

          <div style={contentSectionStyle}>
            <h2 style={contentTitleStyle}>Why Choose SmartSeason?</h2>
            <p style={contentTextStyle}>
              SmartSeason transforms agricultural field management by digitizing manual processes. Traditional agriculture relies on time-consuming inspections and paper-based records, leading to inefficiencies and missed opportunities. Our platform automates field monitoring, provides real-time updates, and delivers actionable insights to help you optimize crop management and increase farm productivity.
            </p>
            <p style={contentTextStyle}>
              Whether you manage a single field or hundreds of acres, SmartSeason scales with your operations. Reduce operational costs, improve crop yields, and make faster decisions with comprehensive data visibility.
            </p>
          </div>

          <div style={contentSectionStyle}>
            <h2 style={contentTitleStyle}>Key Benefits</h2>
            <ul style={benefitsListStyle}>
              <li style={benefitItemStyle}>Automated field monitoring and status updates</li>
              <li style={benefitItemStyle}>Historical data tracking for informed decision-making</li>
              <li style={benefitItemStyle}>Role-based access control for secure operations</li>
              <li style={benefitItemStyle}>Real-time alerts and notifications</li>
              <li style={benefitItemStyle}>Mobile-friendly interface for on-the-go access</li>
              <li style={benefitItemStyle}>Scalable solution for farms of any size</li>
            </ul>
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
