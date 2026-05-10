// ============================================================
// AutoHarvest — API Client (Axios + JWT interceptors)
// ============================================================

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  CreateWorldRequest,
  WorldSummary,
  SaveGameData,
  UserProfile,
} from '@autoharvest/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ─── Axios Instance ──────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 → logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      // Redirect to login if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth API ────────────────────────────────────────────

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await api.get<UserProfile>('/users/profile');
    return res.data;
  },
};

// ─── Worlds API ──────────────────────────────────────────

export interface WorldResponse {
  id: string;
  name: string;
  seed: string;
  userId: string;
  createdAt: string;
}

export const worldsApi = {
  list: async (): Promise<WorldResponse[]> => {
    const res = await api.get<WorldResponse[]>('/games/worlds');
    return res.data;
  },

  create: async (data: CreateWorldRequest): Promise<WorldResponse> => {
    const res = await api.post<WorldResponse>('/games/worlds', data);
    return res.data;
  },

  get: async (worldId: string): Promise<WorldResponse> => {
    const res = await api.get<WorldResponse>(`/games/worlds/${worldId}`);
    return res.data;
  },

  delete: async (worldId: string): Promise<void> => {
    await api.delete(`/games/worlds/${worldId}`);
  },

  save: async (worldId: string, serializedState: string): Promise<SaveGameData> => {
    const res = await api.post<SaveGameData>(`/games/worlds/${worldId}/save`, { serializedState });
    return res.data;
  },

  load: async (worldId: string): Promise<SaveGameData> => {
    const res = await api.get<SaveGameData>(`/games/worlds/${worldId}/load`);
    return res.data;
  },
};

// ─── Validation API ──────────────────────────────────────

export interface PurchaseRequest {
  itemId: string;
  worldId: string;
  currentGold: number;
  currentTier: number;
  purchasedItems: string[];
}

export interface PurchaseResponse {
  success: boolean;
  newGold: number;
  message?: string;
}

export const validationApi = {
  validatePurchase: async (data: PurchaseRequest): Promise<PurchaseResponse> => {
    const res = await api.post<PurchaseResponse>('/games/validate-purchase', data);
    return res.data;
  },
};

export default api;
