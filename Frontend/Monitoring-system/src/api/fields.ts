import api from './client';

export interface Field {
  id: number;
  name: string;
  location?: string;
  area_hectares?: number;
  soil_type?: string;
  crop_type?: string;
  planting_date?: string;
  expected_harvest_date?: string;
  status: string;
  current_stage: string;
  notes?: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface FieldCreate {
  name: string;
  location?: string;
  area_hectares?: number;
  soil_type?: string;
  crop_type?: string;
  planting_date?: string;
  expected_harvest_date?: string;
}

export interface FieldUpdate {
  name?: string;
  location?: string;
  area_hectares?: number;
  soil_type?: string;
  crop_type?: string;
  planting_date?: string;
  expected_harvest_date?: string;
  status?: string;
  current_stage?: string;
  notes?: string;
}

export interface FieldUpdateEntry {
  id: number;
  field_id: number;
  stage?: string;
  status?: string;
  notes?: string;
  image_url?: string;
  reported_by: number;
  created_at: string;
}

export const fieldsApi = {
  getFields: async (): Promise<Field[]> => {
    const response = await api.get('/fields');
    return response.data;
  },

  getField: async (id: number): Promise<Field> => {
    const response = await api.get(`/fields/${id}`);
    return response.data;
  },

  createField: async (data: FieldCreate): Promise<Field> => {
    const response = await api.post('/fields', data);
    return response.data;
  },

  updateField: async (id: number, data: FieldUpdate): Promise<Field> => {
    const response = await api.put(`/fields/${id}`, data);
    return response.data;
  },

  deleteField: async (id: number): Promise<void> => {
    await api.delete(`/fields/${id}`);
  },

  getFieldUpdates: async (fieldId: number): Promise<FieldUpdateEntry[]> => {
    const response = await api.get(`/fields/${fieldId}/updates`);
    return response.data;
  },

  createFieldUpdate: async (fieldId: number, data: Partial<FieldUpdateEntry>): Promise<FieldUpdateEntry> => {
    const response = await api.post(`/fields/${fieldId}/updates`, data);
    return response.data;
  },
};