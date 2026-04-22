import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>SmartSeason</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" onClick={onClose}>Dashboard</NavLink>
        <NavLink to="/fields" onClick={onClose}>Fields</NavLink>
        <NavLink to="/agents" onClick={onClose}>Agents</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;