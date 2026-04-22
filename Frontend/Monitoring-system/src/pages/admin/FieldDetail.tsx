import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fieldsApi, Field, FieldUpdateEntry } from '../api/fields';
import { StatusBadge } from '../components/fields/StatusBadge';
import { StageBadge } from '../components/fields/StageBadge';

const FieldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [field, setField] = useState<Field | null>(null);
  const [updates, setUpdates] = useState<FieldUpdateEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadField = async () => {
      if (!id) return;
      try {
        const fieldData = await fieldsApi.getField(Number(id));
        setField(fieldData);
        const updatesData = await fieldsApi.getFieldUpdates(Number(id));
        setUpdates(updatesData);
      } catch (error) {
        console.error('Failed to load field:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadField();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (!field) return <div>Field not found</div>;

  return (
    <div className="field-detail-page">
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>{field.name}</h1>
      <div className="field-detail-grid">
        <div className="field-info">
          <p><strong>Location:</strong> {field.location || 'N/A'}</p>
          <p><strong>Area:</strong> {field.area_hectares ? `${field.area_hectares} ha` : 'N/A'}</p>
          <p><strong>Soil Type:</strong> {field.soil_type || 'N/A'}</p>
          <p><strong>Crop Type:</strong> {field.crop_type || 'N/A'}</p>
          <p><strong>Status:</strong> <StatusBadge status={field.status} /></p>
          <p><strong>Stage:</strong> <StageBadge stage={field.current_stage} /></p>
        </div>
        <div className="field-updates">
          <h2>Update History</h2>
          {updates.length === 0 ? (
            <p>No updates yet</p>
          ) : (
            <ul>
              {updates.map(update => (
                <li key={update.id}>
                  <p>{update.notes}</p>
                  <small>{new Date(update.created_at).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;