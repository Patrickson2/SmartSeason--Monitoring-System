import React, { useEffect, useState } from 'react';
import { fieldsApi, Field, FieldCreate } from '../api/fields';
import { FieldCard } from '../components/fields/FieldCard';
import { FieldForm } from '../components/fields/FieldForm';
import { Modal } from '../components/ui/Modal';

const Fields: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

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

  const handleCreateField = async (data: FieldCreate) => {
    await fieldsApi.createField(data);
    setShowModal(false);
    loadFields();
  };

  const handleUpdateField = async (data: FieldCreate) => {
    if (selectedField) {
      await fieldsApi.updateField(selectedField.id, data);
      setSelectedField(null);
      setShowModal(false);
      loadFields();
    }
  };

  const handleDeleteField = async (id: number) => {
    if (confirm('Are you sure you want to delete this field?')) {
      await fieldsApi.deleteField(id);
      loadFields();
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="fields-page">
      <div className="page-header">
        <h1>Fields</h1>
        <button onClick={() => setShowModal(true)}>Add Field</button>
      </div>
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
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedField(null);
        }}
        title={selectedField ? 'Edit Field' : 'Add Field'}
      >
        <FieldForm
          initialData={selectedField || undefined}
          onSubmit={selectedField ? handleUpdateField : handleCreateField}
          onCancel={() => {
            setShowModal(false);
            setSelectedField(null);
          }}
        />
      </Modal>

      {selectedField && (
        <Modal
          isOpen={!!selectedField && !showModal}
          onClose={() => setSelectedField(null)}
          title={selectedField.name}
        >
          <div className="field-detail">
            <p><strong>Location:</strong> {selectedField.location}</p>
            <p><strong>Area:</strong> {selectedField.area_hectares} ha</p>
            <p><strong>Status:</strong> {selectedField.status}</p>
            <p><strong>Stage:</strong> {selectedField.current_stage}</p>
            <div className="field-actions">
              <button onClick={() => setShowModal(true)}>Edit</button>
              <button onClick={() => handleDeleteField(selectedField.id)}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Fields;