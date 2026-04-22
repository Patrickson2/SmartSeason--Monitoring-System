import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColors: Record<string, string> = {
    active: '#28a745',
    fallow: '#ffc107',
    planted: '#17a2b8',
    harvested: '#6c757d',
  };

  return (
    <span
      className="badge status-badge"
      style={{ backgroundColor: statusColors[status.toLowerCase()] || '#ccc' }}
    >
      {status}
    </span>
  );
};