/**
 * Authentication Service for TrashIA
 * Handles API calls and token management
 */
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  MessageResponse,
  Tokens,
  User,
  UserProfile,
  UpdateProfileRequest,
} from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ============================================
// TOKEN STORAGE
// ============================================

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'auth_user';

export const storeTokens = (tokens: Tokens): void => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const getStoredTokens = (): Tokens | null => {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const storeUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ============================================
// HELPERS
// ============================================

const getAuthHeaders = (): HeadersInit => {
  const tokens = getStoredTokens();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (tokens?.access_token) {
    headers['Authorization'] = `Bearer ${tokens.access_token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle different error formats from backend
    const errorMessage = data.detail || data.message || 'Error de autenticación';
    throw new Error(errorMessage);
  }
  
  return data as T;
};

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  /**
   * Logout current user
   */
  async logout(): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<MessageResponse>(response);
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    return handleResponse<Tokens>(response);
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<User>(response);
  },

  /**
   * Resend email verification
   */
  async resendVerification(email: string): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse<MessageResponse>(response);
  },

  /**
   * Request password reset email
   */
  async forgotPassword(email: string): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse<MessageResponse>(response);
  },

  /**
   * Reset password with token
   */
  async resetPassword(accessToken: string, newPassword: string, refreshToken?: string | null): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        access_token: accessToken, 
        refresh_token: refreshToken || null,
        new_password: newPassword 
      }),
    });
    return handleResponse<MessageResponse>(response);
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<UserProfile>(response);
  },

  /**
   * Validate current token
   */
  async validateToken(): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/auth/validate`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<MessageResponse>(response);
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: File): Promise<string> {
    const tokens = getStoredTokens();
    const formData = new FormData();
    formData.append('file', file);
    
    const headers: HeadersInit = {};
    if (tokens?.access_token) {
      headers['Authorization'] = `Bearer ${tokens.access_token}`;
    }
    
    const response = await fetch(`${API_URL}/auth/profile/picture`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    const data = await handleResponse<{ url: string; message: string }>(response);
    return data.url;
  },

  /**
   * Change password with current password verification
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });
    return handleResponse<MessageResponse>(response);
  },
};

export default authService;
