import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: 'var(--spacing-xl) 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)'
        }}>
          <h1 style={{
            fontSize: '3rem',
            marginBottom: 'var(--spacing-md)',
            fontWeight: 700
          }}>
            SmartSeason
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: 'var(--spacing-xl)',
            opacity: 0.9
          }}>
            Agricultural Field Monitoring and Management System
          </p>
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'}
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '1.125rem',
                fontWeight: 500,
                transition: 'background-color 0.2s ease'
              }}
            >
              Go to Dashboard →
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-accent)',
                color: 'white',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '1.125rem',
                fontWeight: 500,
                transition: 'background-color 0.2s ease'
              }}
            >
              Sign In →
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'var(--spacing-xl) 0' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2rem',
            marginBottom: 'var(--spacing-xl)',
            color: 'var(--color-text)'
          }}>
            Why SmartSeason?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            <div style={featureCardStyle}>
              <div style={iconStyle}>🌱</div>
              <h3 style={featureTitleStyle}>Real-time Field Monitoring</h3>
              <p style={featureTextStyle}>
                Track crop growth stages, monitor field conditions, and receive alerts when fields need attention.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconStyle}>📊</div>
              <h3 style={featureTitleStyle}>Data-Driven Insights</h3>
              <p style={featureTextStyle}>
                Make informed decisions with comprehensive analytics and historical field data.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconStyle}>👥</div>
              <h3 style={featureTitleStyle}>Role-Based Access</h3>
              <p style={featureTextStyle}>
                Secure system with separate interfaces for administrators and field agents.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconStyle}>📱</div>
              <h3 style={featureTitleStyle}>Mobile-Friendly</h3>
              <p style={featureTextStyle}>
                Responsive design that works seamlessly on desktop, tablet, and mobile devices.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconStyle}>⚡</div>
              <h3 style={featureTitleStyle}>Fast & Reliable</h3>
              <p style={featureTextStyle}>
                Built with modern technologies for optimal performance and reliability.
              </p>
            </div>

            <div style={featureCardStyle}>
              <div style={iconStyle}>🔒</div>
              <h3 style={featureTitleStyle}>Secure & Private</h3>
              <p style={featureTextStyle}>
                Enterprise-grade security with encrypted data and role-based permissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section style={{
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--spacing-xl) 0'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-lg)', color: 'var(--color-text)' }}>
            The Problem
          </h2>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            Traditional agriculture relies on manual field inspections and paper-based records.
            Farmers and farm managers struggle to monitor multiple fields efficiently,
            leading to delayed responses to crop issues, inefficient resource allocation,
            and lost productivity.
          </p>

          <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-lg)', color: 'var(--color-text)' }}>
            Our Solution
          </h2>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            SmartSeason digitizes field management with real-time monitoring,
            automated status updates, and comprehensive analytics.
            Our platform helps agricultural professionals make data-driven decisions,
            optimize crop management, and increase overall farm productivity.
          </p>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section style={{ padding: 'var(--spacing-xl) 0' }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--color-text)'
          }}>
            Built with Modern Technology
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <div style={techItemStyle}>
              <div style={techIconStyle}>🐍</div>
              <div>FastAPI</div>
            </div>
            <div style={techItemStyle}>
              <div style={techIconStyle}>⚛️</div>
              <div>React</div>
            </div>
            <div style={techItemStyle}>
              <div style={techIconStyle}>🐘</div>
              <div>PostgreSQL</div>
            </div>
            <div style={techItemStyle}>
              <div style={techIconStyle}>🗄️</div>
              <div>SQLAlchemy</div>
            </div>
            <div style={techItemStyle}>
              <div style={techIconStyle}>🔐</div>
              <div>JWT Auth</div>
            </div>
            <div style={techItemStyle}>
              <div style={techIconStyle}>📡</div>
              <div>REST API</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        padding: 'var(--spacing-lg) 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)'
        }}>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>
            © 2026 SmartSeason - Agricultural Field Monitoring System
          </p>
        </div>
      </footer>
    </div>
  );
}

const featureCardStyle = {
  backgroundColor: 'var(--color-surface)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  textAlign: 'center' as const,
  border: '1px solid var(--color-border)',
};

const iconStyle = {
  fontSize: '2.5rem',
  marginBottom: 'var(--spacing-md)',
};

const featureTitleStyle = {
  fontSize: '1.125rem',
  marginBottom: 'var(--spacing-sm)',
  color: 'var(--color-text)',
};

const featureTextStyle = {
  color: 'var(--color-text-muted)',
  lineHeight: 1.5,
};

const techItemStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  padding: 'var(--spacing-md)',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-sm)',
};

const techIconStyle = {
  fontSize: '1.5rem',
  marginBottom: 'var(--spacing-xs)',
};