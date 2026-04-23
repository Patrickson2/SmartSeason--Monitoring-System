export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export type CropStage = 'planted' | 'growing' | 'ready' | 'harvested';
export type FieldStatus = 'active' | 'at_risk' | 'completed';

export interface Field {
  id: string;
  name: string;
  crop_type: string;
  planting_date: string | null;
  current_stage: CropStage;
  status: FieldStatus;
  notes: string | null;
  assigned_agent_id: string | null;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface FieldUpdate {
  id: string;
  field_id: string;
  agent_id: string;
  stage_changed_to: CropStage | null;
  observation: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  fields_count: number;
}

export interface FieldCreate {
  name: string;
  crop_type: string;
  planting_date?: string;
  assigned_agent_id?: string;
  notes?: string;
}