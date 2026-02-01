/**
 * Authentication Context for TrashIA
 * Provides global auth state and methods
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  authService,
  storeTokens,
  storeUser,
  getStoredTokens,
  getStoredUser,
  clearAuthStorage,
} from '../services/auth';
import type {
  AuthContextType,
  AuthState,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  MessageResponse,
} from '../types/auth.types';

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
  isEmailVerified: false,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage on mount
  useEffect(() => {
    const initAuth = async () => {
      const tokens = getStoredTokens();
      const user = getStoredUser();

      if (tokens && user) {
        try {
          // Validate stored token
          await authService.validateToken();
          setState({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            isEmailVerified: user.email_verified,
          });
        } catch {
          // Token invalid, try to refresh
          try {
            if (tokens.refresh_token) {
              const newTokens = await authService.refreshTokens(tokens.refresh_token);
              const currentUser = await authService.getCurrentUser();
              storeTokens(newTokens);
              storeUser(currentUser);
              setState({
                user: currentUser,
                tokens: newTokens,
                isAuthenticated: true,
                isLoading: false,
                isEmailVerified: currentUser.email_verified,
              });
            } else {
              throw new Error('No refresh token');
            }
          } catch {
            // Refresh failed, clear storage
            clearAuthStorage();
            setState({ ...initialState, isLoading: false });
          }
        }
      } else {
        setState({ ...initialState, isLoading: false });
      }
    };

    initAuth();
  }, []);

  // Auto-refresh tokens before expiry
  useEffect(() => {
    if (!state.tokens?.expires_at) return;

    const expiresAt = state.tokens.expires_at * 1000; // Convert to ms
    const refreshAt = expiresAt - 5 * 60 * 1000; // 5 minutes before expiry
    const timeout = refreshAt - Date.now();

    if (timeout > 0) {
      const timerId = setTimeout(async () => {
        try {
          await refreshTokens();
        } catch (err) {
          console.error('Auto-refresh failed:', err);
        }
      }, timeout);

      return () => clearTimeout(timerId);
    }
  }, [state.tokens]);

  // Login
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      storeTokens(response.tokens);
      storeUser(response.user);
      setState({
        user: response.user,
        tokens: response.tokens,
        isAuthenticated: true,
        isLoading: false,
        isEmailVerified: response.user.email_verified,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    }
  }, []);

  // Register
  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setError(null);
      const response = await authService.register(userData);

      // Store user info (may not have valid tokens if email verification required)
      if (response.tokens.access_token) {
        storeTokens(response.tokens);
      }
      storeUser(response.user);

      setState({
        user: response.user,
        tokens: response.tokens.access_token ? response.tokens : null,
        isAuthenticated: !!response.tokens.access_token,
        isLoading: false,
        isEmailVerified: response.user.email_verified,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
      throw err;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors - we clear local state anyway
    } finally {
      clearAuthStorage();
      setState({ ...initialState, isLoading: false });
      setError(null);
    }
  }, []);

  // Refresh tokens
  const refreshTokens = useCallback(async () => {
    const tokens = getStoredTokens();
    if (!tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    const newTokens = await authService.refreshTokens(tokens.refresh_token);
    storeTokens(newTokens);
    setState((prev) => ({ ...prev, tokens: newTokens }));
  }, []);

  // Resend verification email
  const resendVerification = useCallback(async (email: string): Promise<MessageResponse> => {
    return authService.resendVerification(email);
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email: string): Promise<MessageResponse> => {
    return authService.forgotPassword(email);
  }, []);

  // Reset password
  const resetPassword = useCallback(
    async (token: string, newPassword: string, refreshToken?: string | null): Promise<MessageResponse> => {
      return authService.resetPassword(token, newPassword, refreshToken);
    },
    []
  );

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    const updatedProfile = await authService.updateProfile(data);
    setState((prev) => ({
      ...prev,
      user: prev.user
        ? {
            ...prev.user,
            profile: updatedProfile,
          }
        : null,
    }));
    // Update stored user
    const currentUser = getStoredUser();
    if (currentUser) {
      storeUser({ ...currentUser, profile: updatedProfile });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshTokens,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateProfile,
    clearError,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
