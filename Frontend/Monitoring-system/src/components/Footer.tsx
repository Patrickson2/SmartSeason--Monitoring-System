import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  isAuthenticated?: boolean;
  userRole?: string;
  dashboardRoute?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  isAuthenticated = false, 
  userRole, 
  dashboardRoute 
}) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      padding: '3rem 0 1rem',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '3rem',
          marginBottom: '2rem',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
            gap: '2rem',
            textAlign: 'center'
          }
        } as React.CSSProperties}>
          
          {/* Company Section */}
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0 0 1rem 0',
              color: '#4CAF50'
            }}>
              SmartSeason
            </h3>
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.6',
              margin: '0 0 1.5rem 0',
              color: '#b0b0b0',
              maxWidth: '300px'
            }}>
              Advanced agricultural field monitoring system designed to optimize crop management and increase farm productivity through real-time data insights.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              '@media (max-width: 768px)': {
                justifyContent: 'center'
              }
            } as React.CSSProperties}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(91, 133, 93, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              color: '#ffffff'
            }}>
              Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <li>
                <Link 
                  to="/" 
                  style={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s',
                    ':hover': { color: '#4CAF50' }
                  } as React.CSSProperties}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  style={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s',
                    ':hover': { color: '#4CAF50' }
                  } as React.CSSProperties}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  style={{
                    color: '#b0b0b0',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s',
                    ':hover': { color: '#4CAF50' }
                  } as React.CSSProperties}
                >
                  Contact
                </Link>
              </li>
              {isAuthenticated && dashboardRoute && (
                <li>
                  <Link 
                    to={dashboardRoute} 
                    style={{
                      color: '#b0b0b0',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.3s',
                      ':hover': { color: '#4CAF50' }
                    } as React.CSSProperties}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              color: '#ffffff'
            }}>
              Features
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <li style={{ color: '#b0b0b0', fontSize: '0.95rem' }}>
                Real-time Monitoring
              </li>
              <li style={{ color: '#b0b0b0', fontSize: '0.95rem' }}>
                Data Analytics
              </li>
              <li style={{ color: '#b0b0b0', fontSize: '0.95rem' }}>
                AI Insights
              </li>
              <li style={{ color: '#b0b0b0', fontSize: '0.95rem' }}>
                Mobile Access
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              margin: '0 0 1rem 0',
              color: '#ffffff'
            }}>
              Contact
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <div style={{ color: '#b0b0b0', fontSize: '0.95rem' }}>
                <strong style={{ color: '#4CAF50' }}>Email:</strong> support@smartseason.com
              </div>
              <div style={{ color: '#b0b0b0', fontSize: '0.95rem' }}>
                <strong style={{ color: '#4CAF50' }}>Phone:</strong> +254 700 000 000
              </div>
              <div style={{ color: '#b0b0b0', fontSize: '0.95rem' }}>
                <strong style={{ color: '#4CAF50' }}>Location:</strong> Nairobi, Kenya
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            textAlign: 'center'
          }
        } as React.CSSProperties}>
          <div style={{
            color: '#b0b0b0',
            fontSize: '0.9rem'
          }}>
            © {currentYear} SmartSeason. All rights reserved.
          </div>
          <div style={{
            display: 'flex',
            gap: '2rem',
            '@media (max-width: 768px)': {
              justifyContent: 'center'
            }
          } as React.CSSProperties}>
            <Link to="/privacy" style={{
              color: '#b0b0b0',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.3s'
            }}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{
              color: '#b0b0b0',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.3s'
            }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
