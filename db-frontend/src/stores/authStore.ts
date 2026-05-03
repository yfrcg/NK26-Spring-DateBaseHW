import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  isReady: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  setSession: (token: string, user: User) => void;
  syncUser: (user: User) => void;
  setReady: () => void;
  logout: () => void;
}

function readStoredUser() {
  const raw = localStorage.getItem('userInfo');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem('userInfo');
    return null;
  }
}

function readStoredToken() {
  return localStorage.getItem('token');
}

const storedUser = readStoredUser();
const storedToken = readStoredToken();

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser,
  isReady: false,
  isLoggedIn: !!storedToken,
  isAdmin: storedUser?.userType === 'ADMIN',
  setSession: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(user));
    set({
      token,
      user,
      isReady: true,
      isLoggedIn: true,
      isAdmin: user.userType === 'ADMIN',
    });
  },
  syncUser: (user) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
    set((state) => ({
      user,
      isReady: true,
      isLoggedIn: !!state.token,
      isAdmin: user.userType === 'ADMIN',
    }));
  },
  setReady: () => {
    set((state) => ({
      ...state,
      isReady: true,
      isLoggedIn: !!state.token,
      isAdmin: state.user?.userType === 'ADMIN',
    }));
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    set({
      token: null,
      user: null,
      isReady: true,
      isLoggedIn: false,
      isAdmin: false,
    });
  },
}));
