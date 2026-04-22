export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: 'admin' | 'agent';
  is_active: boolean;
  created_at: string;
}

export interface Field {
  id: number;
  name: string;
  location?: string;
  area_hectares?: number;
  soil_type?: string;
  crop_type?: string;
  planting_date?: string;
  expected_harvest_date?: string;
  status: FieldStatus;
  current_stage: CropStage;
  notes?: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
}

export interface FieldUpdate {
  id: number;
  field_id: number;
  stage?: CropStage;
  status?: FieldStatus;
  notes?: string;
  image_url?: string;
  reported_by: number;
  created_at: string;
}

export type FieldStatus = 'active' | 'fallow' | 'planted' | 'harvested';

export type CropStage = 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'mature';

export interface ApiError {
  detail: string;
}