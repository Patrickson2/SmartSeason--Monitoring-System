import React from 'react';
import { Field } from '../../api/fields';
import { StatusBadge } from './StatusBadge';
import { StageBadge } from './StageBadge';

interface FieldCardProps {
  field: Field;
  onClick?: () => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field, onClick }) => {
  return (
    <div className="field-card" onClick={onClick}>
      <div className="field-card-header">
        <h3>{field.name}</h3>
        <StatusBadge status={field.status} />
      </div>
      <div className="field-card-body">
        <p><strong>Location:</strong> {field.location || 'N/A'}</p>
        <p><strong>Area:</strong> {field.area_hectares ? `${field.area_hectares} ha` : 'N/A'}</p>
        <p><strong>Crop:</strong> {field.crop_type || 'N/A'}</p>
        <StageBadge stage={field.current_stage} />
      </div>
    </div>
  );
};