import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface User {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  authenticated: boolean | null;
}

interface AuthContextProps {
  authState: AuthState;
  onRegister: (name: string, email: string, password: string, password_confirmation: string) => Promise<any | void>;
  onLogin: (email: string, password: string) => Promise<{ error?: boolean; msg?: string; data?: any }>;
  onLogout: () => Promise<void>;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    authenticated: false
  });

  useEffect(() => {
    const loadAuthData = async () => {
      const user = await SecureStore.getItemAsync('APP_USER');
      const token = await SecureStore.getItemAsync('APP_TOKEN');

      if (user && token) {
        axios.defaults.headers.common['Authorization'] = `${token}`;
        setAuthState({
          token,
          user: JSON.parse(user),
          authenticated: true,
        });
      }
    };

    loadAuthData();
  }, []);

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password, password_confirmation });
      return { data: response.data };
      // login(email, password);
    } catch (error: any) {
      return {
        error: true,
        msg: error.response?.data?.msg || 'Login failed',
        data: null,
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      setAuthState({
        token: response.data.token,
        user: response.data.user,
        authenticated: true,
      });

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      await SecureStore.setItemAsync('APP_USER', JSON.stringify(response.data.user));
      await SecureStore.setItemAsync('APP_TOKEN', response.data.token);

      return { data: response.data };
    } catch (error: any) {
      return {
        error: true,
        msg: error.response?.data?.msg || 'Login failed',
        data: null,
      };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('APP_USER');
    await SecureStore.deleteItemAsync('APP_TOKEN');
    delete axios.defaults.headers.common['Authorization'];

    setAuthState({
      token: null,
      user: null,
      authenticated: false,
    });
  };

  const value = {
    authState,
    onRegister: register,
    onLogin: login,
    onLogout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}