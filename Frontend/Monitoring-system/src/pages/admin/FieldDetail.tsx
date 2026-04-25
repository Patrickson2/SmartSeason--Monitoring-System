import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fieldsApi, usersApi } from '../../api';
import type { FieldWithHistory, Agent, FieldUpdate } from '../../types';
import StageBadge from '../../components/StageBadge';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

export default function AdminFieldDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showReassignModal, setShowReassignModal] = useState(false);

  const { data: field, isLoading } = useQuery<FieldWithHistory>({
    queryKey: ['field-detail', id],
    queryFn: () => fieldsApi.getFieldDetail(id!),
    enabled: !!id,
  });

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: usersApi.getAgents,
  });

  const assignMutation = useMutation({
    mutationFn: (agentId: string) => fieldsApi.assignAgent(id!, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      setShowReassignModal(false);
    },
  });

  if (isLoading) return <div style={{ padding: 'var(--spacing-xl)' }}><p>Loading...</p></div>;
  if (!field) return <div style={{ padding: 'var(--spacing-xl)' }}><p>Field not found</p></div>;

  const approvedAgents = agents.filter((a) => a.approval_status === 'approved');

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <button onClick={() => navigate('/admin/fields')} className="btn btn-secondary" style={{ marginBottom: 'var(--spacing-md)' }}>
        &larr; Back to Fields
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1>{field.name}</h1>
          <p className="text-muted">{field.crop_type}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
          <StatusBadge status={field.status} />
          <StageBadge stage={field.current_stage} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginTop: 0 }}>Field Info</h3>
          <p><strong>Planting Date:</strong> {field.planting_date ? new Date(field.planting_date).toLocaleDateString() : 'Not set'}</p>
          <p><strong>Current Stage:</strong> <StageBadge stage={field.current_stage} /></p>
          <p><strong>Status:</strong> <StatusBadge status={field.status} /></p>
          <p><strong>Notes:</strong> {field.notes || 'None'}</p>
        </div>

        <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0 }}>Assignment</h3>
            <button onClick={() => setShowReassignModal(true)} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
              Reassign Agent
            </button>
          </div>
          <p><strong>Assigned Agent:</strong> {field.assigned_agent_id ? agents.find((a) => a.id === field.assigned_agent_id)?.name || 'Unknown' : 'Unassigned'}</p>
          <p><strong>Created:</strong> {new Date(field.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ marginTop: 0 }}>Update History</h3>
        {field.updates.length === 0 ? (
          <p className="text-muted">No updates yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Stage Change</th>
                <th style={thStyle}>Observation</th>
              </tr>
            </thead>
            <tbody>
              {field.updates.map((update: FieldUpdate) => (
                <tr key={update.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}>{new Date(update.created_at).toLocaleDateString()}</td>
                  <td style={tdStyle}>{update.stage_changed_to ? <StageBadge stage={update.stage_changed_to} /> : '-'}</td>
                  <td style={tdStyle}>{update.observation || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showReassignModal} onClose={() => setShowReassignModal(false)} title="Reassign Agent">
        <p style={{ marginBottom: 'var(--spacing-md)' }}>Select a new agent for this field:</p>
        {approvedAgents.length === 0 ? (
          <p className="text-muted">No approved agents available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {approvedAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => assignMutation.mutate(agent.id)}
                disabled={assignMutation.isPending || agent.id === field.assigned_agent_id}
                style={{
                  textAlign: 'left',
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: agent.id === field.assigned_agent_id ? 'var(--color-bg)' : 'var(--color-surface)',
                  cursor: agent.id === field.assigned_agent_id ? 'default' : 'pointer',
                  opacity: agent.id === field.assigned_agent_id ? 0.6 : 1,
                }}
              >
                <strong>{agent.name}</strong>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginLeft: '8px' }}>
                  {agent.fields_count} fields
                </span>
                {agent.id === field.assigned_agent_id && <span style={{ color: 'var(--color-primary)', marginLeft: '8px', fontSize: '0.75rem' }}>(Current)</span>}
              </button>
            ))}
          </div>
        )}
        {assignMutation.isError && <p className="error-text" style={{ marginTop: 'var(--spacing-sm)' }}>Failed to reassign agent.</p>}
      </Modal>
    </div>
  );
}

const thStyle = { padding: 'var(--spacing-md)', textAlign: 'left' as const, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' };
const tdStyle = { padding: 'var(--spacing-md)', fontSize: '0.875rem' };

