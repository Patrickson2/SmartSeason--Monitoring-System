import type { FieldStatus } from '../types';

const statusColors: Record<FieldStatus, string> = {
  active: 'var(--color-primary)',
  at_risk: '#f59e0b',
  completed: '#6b7280',
};

const statusLabels: Record<FieldStatus, string> = {
  active: 'Active',
  at_risk: 'At Risk',
  completed: 'Completed',
};

export default function StatusBadge({ status }: { status: FieldStatus }) {
  const color = statusColors[status] || '#6b7280';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, backgroundColor: color, color: 'white', textTransform: 'capitalize' }}>
      {statusLabels[status] || status}
    </span>
  );
}