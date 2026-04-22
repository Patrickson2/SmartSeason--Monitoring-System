import React from 'react';

interface StageBadgeProps {
  stage: string;
}

export const StageBadge: React.FC<StageBadgeProps> = ({ stage }) => {
  const stageColors: Record<string, string> = {
    germination: '#FFA500',
    vegetative: '#90EE90',
    flowering: '#FF69B4',
    fruiting: '#FFD700',
    mature: '#228B22',
  };

  return (
    <span
      className="badge stage-badge"
      style={{ backgroundColor: stageColors[stage.toLowerCase()] || '#ccc' }}
    >
      {stage}
    </span>
  );
};