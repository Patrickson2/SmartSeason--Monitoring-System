import { Link } from 'react-router-dom';
import type { Field, FieldStatus, CropStage } from '../types';
import StatusBadge from './StatusBadge';
import StageBadge from './StageBadge';

interface FieldCardProps {
  field: Field;
}

export default function FieldCard({ field }: FieldCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{field.name}</h3>
        <StatusBadge status={field.status as FieldStatus} />
      </div>
      
      <p style={{ margin: '0 0 var(--spacing-xs)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
        {field.crop_type}
      </p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
        <StageBadge stage={field.current_stage as CropStage} />
      </div>
      
      {field.planting_date && (
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Planted: {new Date(field.planting_date).toLocaleDateString()}
        </p>
      )}
      
      <Link
        to={`/agent/fields/${field.id}`}
        style={{
          display: 'block',
          marginTop: 'var(--spacing-md)',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          textDecoration: 'none',
          fontSize: '0.875rem',
        }}
      >
        View Details
      </Link>
    </div>
  );
}