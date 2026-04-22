import React, { useEffect, useState } from 'react';
import { fieldsApi, Field, FieldUpdateEntry } from '../api/fields';
import { FieldCard } from '../components/fields/FieldCard';
import { Modal } from '../components/ui/Modal';

const MyFields: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    stage: '',
    status: '',
    notes: '',
  });

  const loadFields = async () => {
    try {
      const data = await fieldsApi.getFields();
      setFields(data);
    } catch (error) {
      console.error('Failed to load fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleSubmitUpdate = async () => {
    if (!selectedField) return;
    try {
      await fieldsApi.createFieldUpdate(selectedField.id, updateData);
      setShowUpdateModal(false);
      setUpdateData({ stage: '', status: '', notes: '' });
    } catch (error) {
      console.error('Failed to submit update:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="my-fields-page">
      <h1>My Fields</h1>
      <div className="fields-grid">
        {fields.map(field => (
          <FieldCard
            key={field.id}
            field={field}
            onClick={() => setSelectedField(field)}
          />
        ))}
      </div>

      <Modal
        isOpen={!!selectedField && !showUpdateModal}
        onClose={() => setSelectedField(null)}
        title={selectedField?.name || ''}
      >
        <div className="field-actions">
          <button onClick={() => setShowUpdateModal(true)}>Report Update</button>
          <button onClick={() => setSelectedField(null)}>Close</button>
        </div>
      </Modal>

      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Report Update"
      >
        <div className="update-form">
          <div className="form-group">
            <label>Stage</label>
            <select
              value={updateData.stage}
              onChange={e => setUpdateData({ ...updateData, stage: e.target.value })}
            >
              <option value="">Select stage</option>
              <option value="germination">Germination</option>
              <option value="vegetative">Vegetative</option>
              <option value="flowering">Flowering</option>
              <option value="fruiting">Fruiting</option>
              <option value="mature">Mature</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={updateData.status}
              onChange={e => setUpdateData({ ...updateData, status: e.target.value })}
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="fallow">Fallow</option>
              <option value="planted">Planted</option>
              <option value="harvested">Harvested</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={updateData.notes}
              onChange={e => setUpdateData({ ...updateData, notes: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSubmitUpdate}>Submit</button>
            <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyFields;