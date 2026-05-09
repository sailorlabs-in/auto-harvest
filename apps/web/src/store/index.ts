// ============================================================
// AutoHarvest — Redux Store Configuration
// ============================================================

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { gameReducer } from './slices/gameSlice';
import { uiReducer } from './slices/uiSlice';
import { authReducer } from './slices/authSlice';
import { progressionReducer } from './slices/progressionSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    ui: uiReducer,
    auth: authReducer,
    progression: progressionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setAuth'],
        ignoredPaths: ['ui.consoleLogs'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
