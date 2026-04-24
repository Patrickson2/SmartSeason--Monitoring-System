import { Link } from 'react-router-dom';
import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            SmartSeason
          </Link>
          <div className="navbar-menu">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/about" className="navbar-link">About</Link>
          </div>
          <Link to="/login" className="navbar-get-started">
            Get Started
          </Link>
          <button className="mobile-menu-button">☰</button>
        </div>
      </nav>

      {/* Contact Content */}
      <section className="contact-section">
        <div className="contact-container">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-intro">
            We're here to help and answer any question you might have
          </p>

          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon">📧</div>
              <h3>Email Us</h3>
              <p>support@smartseason.com</p>
              <p className="contact-note">For support inquiries and general questions</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">🌐</div>
              <h3>Website</h3>
              <p>www.smartseason.com</p>
              <p className="contact-note">Visit our website for more information</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📱</div>
              <h3>Support</h3>
              <p>Available 24/7</p>
              <p className="contact-note">We're always here when you need us</p>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="your@email.com" required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" placeholder="What is this about?" required />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Your message..." rows={6} required></textarea>
              </div>

              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
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
              <Link to="/about" className="footer-link">About</Link>
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
