import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fieldsApi } from '../../api';
import type { Field, FieldStatus } from '../../types';
import StatCard from '../../components/StatCard';

export default function AgentDashboard() {
  const { data: fields = [], isLoading } = useQuery<Field[]>({ 
    queryKey: ['agent-fields'], 
    queryFn: fieldsApi.getFields 
  });

  const totalFields = fields.length;
  const activeFields = fields.filter((f) => f.status === 'active').length;
  const atRiskFields = fields.filter((f) => f.status === 'at_risk').length;
  const completedFields = fields.filter((f) => f.status === 'completed').length;

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1>My Dashboard</h1>
        <p className="text-muted">Your assigned fields overview</p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: 'var(--spacing-md)', 
        marginBottom: 'var(--spacing-xl)' 
      }}>
        <StatCard title="Total Fields" value={totalFields} accentColor="var(--color-primary)" />
        <StatCard title="Active" value={activeFields} accentColor="var(--color-primary-light)" />
        <StatCard title="At Risk" value={atRiskFields} accentColor="#f59e0b" />
        <StatCard title="Completed" value={completedFields} accentColor="#6b7280" />
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
        <Link 
          to="/agent/fields"
          className="btn btn-primary"
        >
          View My Fields
        </Link>
      </div>

      {/* Recent Fields Preview */}
      {fields.length > 0 && (
        <div style={{ marginTop: 'var(--spacing-xl)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Recent Fields</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: 'var(--spacing-md)' 
          }}>
            {fields.slice(0, 4).map((field) => (
              <div
                key={field.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-md)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <h3 style={{ margin: '0 0 var(--spacing-xs)', fontSize: '1rem' }}>{field.name}</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  {field.crop_type}
                </p>
                <p style={{ margin: 'var(--spacing-xs) 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Status: {field.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}