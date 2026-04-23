import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  accentColor?: string;
}

export default function StatCard({ title, value, icon, accentColor }: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--spacing-md)',
        boxShadow: 'var(--shadow-sm)',
        borderLeft: `4px solid ${accentColor || 'var(--color-primary)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
      }}
    >
      {icon && (
        <div style={{ fontSize: '1.5rem', color: accentColor || 'var(--color-primary)' }}>
          {icon}
        </div>
      )}
      <div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </p>
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text)' }}>
          {value}
        </p>
      </div>
    </div>
  );
}