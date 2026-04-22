import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
};