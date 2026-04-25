import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api';
import type { Agent } from '../../types';
import Modal from '../../components/Modal';

interface AgentFormData {
  name: string;
  email: string;
  password: string;
}

export default function AdminAgents() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<AgentFormData>({ name: '', email: '', password: '' });

  const { data: agents = [], isLoading } = useQuery<Agent[]>({ queryKey: ['agents'], queryFn: usersApi.getAgents });

  const createMutation = useMutation({
    mutationFn: (data: AgentFormData) => usersApi.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setShowModal(false);
      setFormData({ name: '', email: '', password: '' });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' }) => usersApi.approveAgent(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      approved: { backgroundColor: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 },
      pending: { backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 },
      rejected: { backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 },
    };
    return <span style={styles[status] || styles.pending}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  if (isLoading) return <div style={{ padding: 'var(--spacing-xl)' }}><p>Loading...</p></div>;

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <div><h1>Agents</h1><p className="text-muted">Manage field agents</p></div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Agent</button>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        {agents.length === 0 ? (
          <p className="text-muted" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>No agents found. Add your first agent.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: 'var(--color-bg)' }}>
              <th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Status</th><th style={thStyle}>Fields</th><th style={thStyle}>Actions</th>
            </tr></thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}>{agent.name}</td>
                  <td style={tdStyle}>{agent.email}</td>
                  <td style={tdStyle}>{getStatusBadge(agent.approval_status)}</td>
                  <td style={tdStyle}>{agent.fields_count}</td>
                  <td style={tdStyle}>
                    {agent.approval_status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => approveMutation.mutate({ id: agent.id, action: 'approve' })}
                          disabled={approveMutation.isPending}
                          style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => approveMutation.mutate({ id: agent.id, action: 'reject' })}
                          disabled={approveMutation.isPending}
                          style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {agent.approval_status === 'approved' && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Active</span>}
                    {agent.approval_status === 'rejected' && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Rejected</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Agent">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="agent-name">Name *</label>
            <input type="text" id="agent-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="agent-email">Email *</label>
            <input type="email" id="agent-email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="agent-password">Password *</label>
            <input type="password" id="agent-password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} minLength={6} required />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Minimum 6 characters</p>
          </div>
          {createMutation.isError && <p className="error-text">Failed to create agent. Email may already exist.</p>}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
            <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Add Agent'}</button>
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const thStyle = { padding: 'var(--spacing-md)', textAlign: 'left' as const, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' };
const tdStyle = { padding: 'var(--spacing-md)', fontSize: '0.875rem' };
