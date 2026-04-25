import { useQuery } from '@tanstack/react-query';
import { fieldsApi, usersApi } from '../../api';
import type { FieldUpdate, Agent, Field } from '../../types';
import StageBadge from '../../components/StageBadge';

interface UpdateWithNames extends FieldUpdate {
  field_name: string;
  agent_name: string;
}

export default function UpdatesMonitor() {
  const { data: updates = [], isLoading: updatesLoading } = useQuery<FieldUpdate[]>({
    queryKey: ['all-updates'],
    queryFn: fieldsApi.getAllUpdates,
  });

  const { data: agents = [], isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: usersApi.getAgents,
  });

  const { data: fields = [], isLoading: fieldsLoading } = useQuery<Field[]>({
    queryKey: ['fields'],
    queryFn: fieldsApi.getFields,
  });

  const isLoading = updatesLoading || agentsLoading || fieldsLoading;

  const getAgentName = (agentId: string) => agents.find((a) => a.id === agentId)?.name || agentId.slice(0, 8);
  const getFieldName = (fieldId: string) => fields.find((f) => f.id === fieldId)?.name || fieldId.slice(0, 8);

  if (isLoading) return <div style={{ padding: 'var(--spacing-xl)' }}><p>Loading...</p></div>;

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1>Updates Monitor</h1>
        <p className="text-muted">All updates across all agents</p>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: 'var(--spacing-lg)' }}>
        {updates.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center' }}>No updates recorded yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Field</th>
                <th style={thStyle}>Agent</th>
                <th style={thStyle}>Stage Change</th>
                <th style={thStyle}>Observation</th>
              </tr>
            </thead>
            <tbody>
              {updates.map((update) => (
                <tr key={update.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}>{new Date(update.created_at).toLocaleDateString()}</td>
                  <td style={tdStyle}>{getFieldName(update.field_id)}</td>
                  <td style={tdStyle}>{getAgentName(update.agent_id)}</td>
                  <td style={tdStyle}>{update.stage_changed_to ? <StageBadge stage={update.stage_changed_to} /> : '-'}</td>
                  <td style={tdStyle}>{update.observation || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: 'var(--spacing-md)', textAlign: 'left' as const, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' };
const tdStyle = { padding: 'var(--spacing-md)', fontSize: '0.875rem' };

