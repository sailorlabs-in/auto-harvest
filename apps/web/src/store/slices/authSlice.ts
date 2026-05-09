// ============================================================
// AutoHarvest — Auth Slice (Redux Toolkit)
// ============================================================

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@autoharvest/shared';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// Load persisted auth from localStorage
function loadPersistedAuth(): AuthState {
  try {
    const stored = localStorage.getItem('autoharvest-auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        user: parsed.user ?? null,
        accessToken: parsed.accessToken ?? null,
        isAuthenticated: !!parsed.accessToken,
      };
    }
  } catch {}
  return { user: null, accessToken: null, isAuthenticated: false };
}

const initialState: AuthState = loadPersistedAuth();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: UserProfile; token: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
      // Persist
      localStorage.setItem(
        'autoharvest-auth',
        JSON.stringify({ user: state.user, accessToken: state.accessToken }),
      );
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('autoharvest-auth');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
