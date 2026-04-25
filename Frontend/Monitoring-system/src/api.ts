import axios, { AxiosError } from 'axios';
import type { AuthResponse, LoginRequest, Field, FieldUpdate, Agent, FieldCreate, AgentRegistrationRequest, FieldWithHistory } from './types';

const API_URL = 'https://smartseason-monitoring-system-7.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },
  registerAgent: async (data: AgentRegistrationRequest): Promise<Agent> => {
    const res = await api.post<Agent>('/auth/register/agent', data);
    return res.data;
  },
};

export const fieldsApi = {
  getFields: async (): Promise<Field[]> => {
    const res = await api.get<Field[]>('/fields');
    return res.data;
  },
  getField: async (id: string): Promise<Field> => {
    const res = await api.get<Field>(`/fields/${id}`);
    return res.data;
  },
  getFieldDetail: async (id: string): Promise<FieldWithHistory> => {
    const res = await api.get<FieldWithHistory>(`/fields/${id}/detail`);
    return res.data;
  },
  createField: async (data: FieldCreate): Promise<Field> => {
    const res = await api.post<Field>('/fields', data);
    return res.data;
  },
  updateFieldStage: async (id: string, stage: string): Promise<Field> => {
    const res = await api.patch<Field>(`/fields/${id}/stage`, { stage });
    return res.data;
  },
  assignAgent: async (id: string, agentId: string | null): Promise<Field> => {
    const res = await api.patch<Field>(`/fields/${id}/assign`, { assigned_agent_id: agentId });
    return res.data;
  },
  getFieldUpdates: async (fieldId: string): Promise<FieldUpdate[]> => {
    const res = await api.get<FieldUpdate[]>(`/fields/${fieldId}/updates`);
    return res.data;
  },
  getAllUpdates: async (): Promise<FieldUpdate[]> => {
    const res = await api.get<FieldUpdate[]>('/fields/updates/all');
    return res.data;
  },
  addFieldUpdate: async (fieldId: string, data: { stage_changed_to?: string; observation?: string }): Promise<FieldUpdate> => {
    const res = await api.post<FieldUpdate>(`/fields/${fieldId}/updates`, data);
    return res.data;
  },
};

export const usersApi = {
  getAgents: async (): Promise<Agent[]> => {
    const res = await api.get<Agent[]>('/users/agents');
    return res.data;
  },
  createAgent: async (data: { name: string; email: string; password: string }): Promise<Agent> => {
    const res = await api.post<Agent>('/users/agents', data);
    return res.data;
  },
  approveAgent: async (agentId: string, action: 'approve' | 'reject'): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>(`/users/agents/${agentId}/approve`, { action });
    return res.data;
  },
};

export const aiApi = {
  analyzeFieldImage: async (fieldId: string, image: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', image);
    const res = await api.post(`/ai/analyze-field/${fieldId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  getFieldInsights: async (fieldId: string): Promise<any> => {
    const res = await api.get(`/ai/insights/${fieldId}`);
    return res.data;
  },
  getSystemStatus: async (): Promise<any> => {
    const res = await api.get('/ai/system-status');
    return res.data;
  },
};

export default api;
