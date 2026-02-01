/**
 * Authentication Types for TrashIA Frontend
 * Aligned with backend Supabase Auth models
 */

// ============================================
// REQUEST TYPES
// ============================================

export interface RegisterRequest {
  name: string;
  last_name: string;
  email: string;
  password: string;
  telephone?: string;
  profile_picture?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  access_token: string;
  new_password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  last_name?: string;
  telephone?: string;
  profile_picture?: string;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface UserProfile {
  id: string;
  name: string;
  last_name: string;
  telephone?: string;
  profile_picture?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  profile?: UserProfile;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
}

export interface AuthResponse {
  user: User;
  tokens: Tokens;
  message?: string;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

// ============================================
// CONTEXT TYPES
// ============================================

export interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailVerified: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  resendVerification: (email: string) => Promise<MessageResponse>;
  forgotPassword: (email: string) => Promise<MessageResponse>;
  resetPassword: (token: string, newPassword: string, refreshToken?: string | null) => Promise<MessageResponse>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  clearError: () => void;
  error: string | null;
}

// ============================================
// FORM TYPES
// ============================================

export interface FormField {
  value: string;
  error: string | null;
  touched: boolean;
}

export interface LoginFormState {
  email: FormField;
  password: FormField;
}

export interface RegisterFormState {
  name: FormField;
  lastName: FormField;
  email: FormField;
  password: FormField;
  confirmPassword: FormField;
  telephone: FormField;
}

export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  score: number;
  level: PasswordStrengthLevel;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}
