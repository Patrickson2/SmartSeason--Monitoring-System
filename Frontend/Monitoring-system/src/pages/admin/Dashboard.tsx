import { useQuery } from '@tanstack/react-query';
import { fieldsApi, usersApi } from '../../api';
import type { Field, Agent, FieldStatus, CropStage } from '../../types';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import StageBadge from '../../components/StageBadge';

export default function AdminDashboard() {
  const { data: fields = [], isLoading: fieldsLoading } = useQuery<Field[]>({ queryKey: ['fields'], queryFn: fieldsApi.getFields });
  const { data: agents = [] } = useQuery<Agent[]>({ queryKey: ['agents'], queryFn: usersApi.getAgents });

  const totalFields = fields.length;
  const activeFields = fields.filter((f) => f.status === 'active').length;
  const atRiskFields = fields.filter((f) => f.status === 'at_risk').length;
  const completedFields = fields.filter((f) => f.status === 'completed').length;

  const getAgentName = (agentId: string | null) => {
    if (!agentId) return '-';
    const agent = agents.find((a) => a.id === agentId);
    return agent?.name || '-';
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };

  if (fieldsLoading) {
    return (
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1>Admin Dashboard</h1>
        <p className="text-muted">Overview of all fields and agents</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
        <StatCard title="Total Fields" value={totalFields} accentColor="var(--color-primary)" />
        <StatCard title="Active" value={activeFields} accentColor="var(--color-primary-light)" />
        <StatCard title="At Risk" value={atRiskFields} accentColor="#f59e0b" />
        <StatCard title="Completed" value={completedFields} accentColor="#6b7280" />
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ margin: 0 }}>All Fields</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                <th style={thStyle}>Field Name</th>
                <th style={thStyle}>Crop Type</th>
                <th style={thStyle}>Assigned Agent</th>
                <th style={thStyle}>Stage</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Planting Date</th>
              </tr>
            </thead>
            <tbody>
              {fields.length === 0 ? (
                <tr><td colSpan={6} style={tdStyle}><p className="text-muted" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>No fields found</p></td></tr>
              ) : (
                fields.map((field) => (
                  <tr key={field.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={tdStyle}>{field.name}</td>
                    <td style={tdStyle}>{field.crop_type}</td>
                    <td style={tdStyle}>{getAgentName(field.assigned_agent_id)}</td>
                    <td style={tdStyle}><StageBadge stage={field.current_stage as CropStage} /></td>
                    <td style={tdStyle}><StatusBadge status={field.status as FieldStatus} /></td>
                    <td style={tdStyle}>{formatDate(field.planting_date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = { padding: 'var(--spacing-md)', textAlign: 'left' as const, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' };
const tdStyle = { padding: 'var(--spacing-md)', fontSize: '0.875rem' };