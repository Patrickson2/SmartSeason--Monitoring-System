import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fieldsApi } from '../../api';
import type { Field, FieldUpdate, CropStage } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import StageBadge from '../../components/StageBadge';

// Stage progression order - agents can only move forward
const STAGE_ORDER: CropStage[] = ['planted', 'growing', 'ready', 'harvested'];

export default function AgentFieldDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [observation, setObservation] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: field, isLoading: fieldLoading } = useQuery<Field>({
    queryKey: ['field', id],
    queryFn: () => fieldsApi.getField(id!),
    enabled: !!id,
  });

  const { data: updates = [], isLoading: updatesLoading } = useQuery<FieldUpdate[]>({
    queryKey: ['field-updates', id],
    queryFn: () => fieldsApi.getFieldUpdates(id!),
    enabled: !!id,
  });

  const stageMutation = useMutation({
    mutationFn: ({ fieldId, stage }: { fieldId: string; stage: string }) => 
      fieldsApi.updateFieldStage(fieldId, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field', id] });
      queryClient.invalidateQueries({ queryKey: ['agent-fields'] });
      setShowSuccess(true);
      setSuccessMessage('Stage updated successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const observationMutation = useMutation({
    mutationFn: ({ fieldId, obs }: { fieldId: string; obs: string }) => 
      fieldsApi.addFieldUpdate(fieldId, { observation: obs }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-updates', id] });
      queryClient.invalidateQueries({ queryKey: ['field', id] });
      setObservation('');
      setShowSuccess(true);
      setSuccessMessage('Observation added successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const currentStageIndex = field ? STAGE_ORDER.indexOf(field.current_stage) : -1;
  const availableStages = currentStageIndex < STAGE_ORDER.length - 1 
    ? STAGE_ORDER.slice(currentStageIndex + 1) 
    : [];

  const handleStageUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newStage = formData.get('newStage') as string;
    if (newStage && id) {
      stageMutation.mutate({ fieldId: id, stage: newStage });
    }
  };

  const handleObservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (observation.trim() && id) {
      observationMutation.mutate({ fieldId: id, obs: observation.trim() });
    }
  };

  if (fieldLoading || updatesLoading) {
    return (
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!field) {
    return (
      <div style={{ padding: 'var(--spacing-xl)' }}>
        <p>Field not found</p>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      {/* Header */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--color-primary)', 
          cursor: 'pointer',
          marginBottom: 'var(--spacing-md)',
          padding: 0,
        }}
      >
        ← Back to My Fields
      </button>

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-md)',
        }}>
          {successMessage}
        </div>
      )}

      {/* Field Info */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
          <div>
            <h1 style={{ margin: 0 }}>{field.name}</h1>
            <p style={{ margin: 'var(--spacing-xs) 0 0', color: 'var(--color-text-muted)' }}>{field.crop_type}</p>
          </div>
          <StatusBadge status={field.status} />
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <StageBadge stage={field.current_stage} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Planting Date</p>
            <p style={{ margin: 0 }}>{field.planting_date ? new Date(field.planting_date).toLocaleDateString() : '-'}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Last Updated</p>
            <p style={{ margin: 0 }}>{new Date(field.updated_at).toLocaleDateString()}</p>
          </div>
        </div>

        {field.notes && (
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Notes</p>
            <p style={{ margin: 0 }}>{field.notes}</p>
          </div>
        )}
      </div>

      {/* Update Stage Form */}
      {availableStages.length > 0 && (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontSize: '1.125rem', margin: '0 0 var(--spacing-md)' }}>Update Stage</h2>
          <form onSubmit={handleStageUpdate}>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label htmlFor="newStage">New Stage</label>
                <select 
                  id="newStage" 
                  name="newStage" 
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Select stage...</option>
                  {availableStages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={stageMutation.isPending}
              >
                {stageMutation.isPending ? 'Updating...' : 'Update Stage'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Observation Form */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h2 style={{ fontSize: '1.125rem', margin: '0 0 var(--spacing-md)' }}>Add Observation</h2>
        <form onSubmit={handleObservationSubmit}>
          <div className="form-group">
            <label htmlFor="observation">Notes</label>
            <textarea
              id="observation"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Describe field conditions, issues, or observations..."
              rows={4}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={observationMutation.isPending || !observation.trim()}
          >
            {observationMutation.isPending ? 'Submitting...' : 'Submit Observation'}
          </button>
        </form>
      </div>

      {/* Update History Timeline */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h2 style={{ fontSize: '1.125rem', margin: '0 0 var(--spacing-md)' }}>Update History</h2>
        
        {updates.length === 0 ? (
          <p className="text-muted">No updates recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {[...updates].reverse().map((update) => (
              <div 
                key={update.id}
                style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--color-primary)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {new Date(update.created_at).toLocaleString()}
                  </span>
                  {update.stage_changed_to && (
                    <StageBadge stage={update.stage_changed_to} />
                  )}
                </div>
                {update.observation && (
                  <p style={{ margin: 0 }}>{update.observation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}