import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fieldsApi, usersApi } from '../../api';
import type { Field, Agent, FieldCreate } from '../../types';
import Modal from '../../components/Modal';

export default function AdminFields() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<FieldCreate>({ name: '', crop_type: '', planting_date: '', notes: '' });

  const { data: fields = [], isLoading } = useQuery<Field[]>({ queryKey: ['fields'], queryFn: fieldsApi.getFields });
  const { data: agents = [] } = useQuery<Agent[]>({ queryKey: ['agents'], queryFn: usersApi.getAgents });

  const createMutation = useMutation({
    mutationFn: (data: FieldCreate) => fieldsApi.createField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      setShowModal(false);
      setFormData({ name: '', crop_type: '', planting_date: '', notes: '' });
    },
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) return <div style={{ padding: 'var(--spacing-xl)' }}><p>Loading...</p></div>;

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <div><h1>Fields</h1><p className="text-muted">Manage all fields</p></div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Field</button>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        {fields.length === 0 ? (
          <p className="text-muted" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>No fields found. Add your first field.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: 'var(--color-bg)' }}>
              <th style={thStyle}>Name</th><th style={thStyle}>Crop Type</th><th style={thStyle}>Stage</th><th style={thStyle}>Assigned To</th><th style={thStyle}>Planting Date</th>
            </tr></thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={tdStyle}>{field.name}</td>
                  <td style={tdStyle}>{field.crop_type}</td>
                  <td style={tdStyle}>{field.current_stage}</td>
                  <td style={tdStyle}>{agents.find((a) => a.id === field.assigned_agent_id)?.name || '-'}</td>
                  <td style={tdStyle}>{field.planting_date ? new Date(field.planting_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Field">
        <form onSubmit={(e) => handleSubmit(e as any)}>
          <div className="form-group">
            <label htmlFor="name">Field Name *</label>
            <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="crop_type">Crop Type *</label>
            <input type="text" id="crop_type" value={formData.crop_type} onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })} placeholder="e.g., Wheat, Corn, Rice" required />
          </div>
          <div className="form-group">
            <label htmlFor="planting_date">Planting Date</label>
            <input type="date" id="planting_date" value={formData.planting_date || ''} onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="assigned_agent">Assign Agent</label>
            <select id="assigned_agent" value={formData.assigned_agent_id || ''} onChange={(e) => setFormData({ ...formData, assigned_agent_id: e.target.value || undefined })}>
              <option value="">-- Select Agent --</option>
              {agents.map((agent) => (<option key={agent.id} value={agent.id}>{agent.name}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
          </div>
          {createMutation.isError && <p className="error-text">Failed to create field</p>}
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
            <button type="submit" className="btn btn-primary" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create Field'}</button>
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

const thStyle = { padding: 'var(--spacing-md)', textAlign: 'left' as const, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' };
const tdStyle = { padding: 'var(--spacing-md)', fontSize: '0.875rem' };