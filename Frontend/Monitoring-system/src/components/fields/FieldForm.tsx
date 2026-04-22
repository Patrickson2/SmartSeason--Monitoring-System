import React, { useState } from 'react';
import { FieldCreate, FieldUpdate } from '../../api/fields';

interface FieldFormProps {
  initialData?: FieldUpdate;
  onSubmit: (data: FieldCreate | FieldUpdate) => Promise<void>;
  onCancel: () => void;
}

export const FieldForm: React.FC<FieldFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FieldCreate | FieldUpdate>(initialData || {
    name: '',
    location: '',
    area_hectares: 0,
    soil_type: '',
    crop_type: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="field-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Field Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="area_hectares">Area (hectares)</label>
        <input
          type="number"
          id="area_hectares"
          name="area_hectares"
          value={formData.area_hectares || 0}
          onChange={handleChange}
          step="0.01"
        />
      </div>
      <div className="form-group">
        <label htmlFor="soil_type">Soil Type</label>
        <input
          type="text"
          id="soil_type"
          name="soil_type"
          value={formData.soil_type || ''}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="crop_type">Crop Type</label>
        <input
          type="text"
          id="crop_type"
          name="crop_type"
          value={formData.crop_type || ''}
          onChange={handleChange}
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};