import { useQuery } from '@tanstack/react-query';
import { fieldsApi } from '../../api';
import type { Field } from '../../types';
import FieldCard from '../../components/FieldCard';

export default function AgentMyFields() {
  const { data: fields = [], isLoading } = useQuery<Field[]>({ 
    queryKey: ['agent-fields'], 
    queryFn: fieldsApi.getFields 
  });

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1>My Fields</h1>
        <p className="text-muted">Fields assigned to you</p>
      </div>

      {fields.length === 0 ? (
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'var(--spacing-xl)', 
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)' 
        }}>
          <p className="text-muted">No fields assigned to you yet.</p>
          <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Contact an admin to get field assignments.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'var(--spacing-md)' 
        }}>
          {fields.map((field) => (
            <FieldCard key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  );
}