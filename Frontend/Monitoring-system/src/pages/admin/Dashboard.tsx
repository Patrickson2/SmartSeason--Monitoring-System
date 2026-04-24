import { useQuery } from '@tanstack/react-query';
import { fieldsApi, usersApi, aiApi } from '../../api';
import type { Field, Agent, FieldStatus, CropStage } from '../../types';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import StageBadge from '../../components/StageBadge';

export default function AdminDashboard() {
  const { data: fields = [], isLoading: fieldsLoading } = useQuery<Field[]>({ queryKey: ['fields'], queryFn: fieldsApi.getFields });
  const { data: agents = [] } = useQuery<Agent[]>({ queryKey: ['agents'], queryFn: usersApi.getAgents });
  const { data: aiStatus } = useQuery({ queryKey: ['ai-status'], queryFn: aiApi.getSystemStatus });

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

      {/* AI System Status */}
      {aiStatus && (
        <div style={{ 
          backgroundColor: 'var(--color-surface)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'var(--spacing-lg)', 
          marginBottom: 'var(--spacing-xl)',
          boxShadow: 'var(--shadow-sm)',
          border: '2px solid rgba(76, 175, 80, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>AI System Status</h2>
            <span style={{
              fontSize: '0.75rem',
              backgroundColor: aiStatus.status === 'operational' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              color: aiStatus.status === 'operational' ? '#4caf50' : '#f44336',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              {aiStatus.status.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {aiStatus.processing_stats?.images_processed_today || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Images Today</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {aiStatus.processing_stats?.crops_analyzed || 0}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Crops Analyzed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4caf50' }}>
                {aiStatus.processing_stats?.accuracy_rate?.split('%')[0] || '0'}%
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>AI Accuracy</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {aiStatus.processing_stats?.average_processing_time?.split('s')[0] || '0'}s
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Avg Processing</div>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-sm)' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem' }}>AI Capabilities:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
              {aiStatus.capabilities?.map((capability: string, index: number) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    color: '#4caf50',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            padding: 'var(--spacing-sm)',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-sm)'
          }}>
            Last updated: {new Date(aiStatus.last_update).toLocaleString()}
          </div>
        </div>
      )}

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