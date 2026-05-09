// ============================================================
// AutoHarvest — API Types
// ============================================================

/** Login request */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Register request */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/** Auth response */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

/** User profile */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

/** World summary (for dashboard listing) */
export interface WorldSummary {
  id: string;
  name: string;
  seed: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalHarvested: number;
    totalPlanted: number;
    gridSize: string;
  };
}

/** Save game data */
export interface SaveGameData {
  id: string;
  worldId: string;
  serializedState: string;
  updatedAt: string;
}

/** Create world request */
export interface CreateWorldRequest {
  name: string;
  seed?: string;
}

/** API error response */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
