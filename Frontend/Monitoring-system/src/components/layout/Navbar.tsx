import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: { username: string; role: string } | null;
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <button className="menu-btn" onClick={onMenuClick}>☰</button>
      <div className="navbar-brand">
        <h1>SmartSeason</h1>
      </div>
      <div className="navbar-user">
        {user && (
          <>
            <span>{user.username} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;