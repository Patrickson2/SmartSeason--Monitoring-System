import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            SmartSeason
          </Link>
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/contact" className="navbar-link">Contact</Link>
          </div>
          <Link to="/login" className="navbar-get-started">
            Get Started
          </Link>
          <button className="mobile-menu-button">☰</button>
        </div>
      </nav>

      {/* About Content */}
      <section className="about-section">
        <div className="about-container">
          <h1 className="about-title">About SmartSeason</h1>
          <p className="about-intro">
            Transforming agricultural field management through technology
          </p>

          <div className="about-features">
            <div className="feature-card">
              <div className="feature-icon">🌾</div>
              <h3>Real-time Monitoring</h3>
              <p>
                Track crop growth stages and field conditions with live updates. Get instant notifications when important changes occur in your fields.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Data-Driven Insights</h3>
              <p>
                Make informed decisions with comprehensive analytics and historical field data. Optimize your farming strategies based on real insights.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Reliable</h3>
              <p>
                Enterprise-grade security with role-based access control. Separate interfaces for administrators and field agents ensuring data integrity.
              </p>
            </div>
          </div>

          <div className="about-content">
            <h2>Why Choose SmartSeason?</h2>
            <p>
              SmartSeason transforms agricultural field management by digitizing manual processes. Traditional agriculture relies on time-consuming inspections and paper-based records, leading to inefficiencies and missed opportunities. Our platform automates field monitoring, provides real-time updates, and delivers actionable insights to help you optimize crop management and increase farm productivity.
            </p>
            <p>
              Whether you manage a single field or hundreds of acres, SmartSeason scales with your operations. Reduce operational costs, improve crop yields, and make faster decisions with comprehensive data visibility.
            </p>
          </div>

          <div className="about-benefits">
            <h2>Key Benefits</h2>
            <ul className="benefits-list">
              <li>Automated field monitoring and status updates</li>
              <li>Historical data tracking for informed decision-making</li>
              <li>Role-based access control for secure operations</li>
              <li>Real-time alerts and notifications</li>
              <li>Mobile-friendly interface for on-the-go access</li>
              <li>Scalable solution for farms of any size</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SmartSeason</h4>
              <p>Agricultural Field Monitoring System</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 SmartSeason. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
