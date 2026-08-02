// authService.js - Replace Promise.resolve with real API calls later
import axios from 'axios';
import { mockUsers, currentUser } from '../mock/users';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Configure axios (replace base URL with your backend)
const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

export const authService = {
  login: async (email, password) => {
    await delay();
    // TODO: Replace with: return api.post('/auth/login', { email, password });
    const user = mockUsers.find(u => u.email === email);
    if (!user || password.length < 6) throw new Error('Invalid credentials');
    const token = 'mock_jwt_token_' + user.id;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { data: { user, token, refreshToken: 'mock_refresh_token' } };
  },

  register: async (data) => {
    await delay();
    // TODO: Replace with: return api.post('/auth/register', data);
    const newUser = { ...currentUser, id: 'u_new', name: data.name, email: data.email, role: 'member' };
    return { data: { user: newUser, message: 'Registration successful! Please verify your email.' } };
  },

  logout: async () => {
    await delay(200);
    // TODO: Replace with: return api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { data: { message: 'Logged out successfully' } };
  },

  forgotPassword: async (email) => {
    await delay();
    // TODO: Replace with: return api.post('/auth/forgot-password', { email });
    return { data: { message: 'Password reset link sent to ' + email } };
  },

  resetPassword: async (token, password) => {
    await delay();
    // TODO: Replace with: return api.post('/auth/reset-password', { token, password });
    return { data: { message: 'Password reset successfully' } };
  },

  verifyOtp: async (otp) => {
    await delay();
    // TODO: Replace with: return api.post('/auth/verify-otp', { otp });
    if (otp === '123456') return { data: { verified: true } };
    throw new Error('Invalid OTP');
  },

  verifyEmail: async (token) => {
    await delay();
    // TODO: Replace with: return api.get(`/auth/verify-email?token=${token}`);
    return { data: { verified: true, message: 'Email verified successfully' } };
  },

  changePassword: async (currentPassword, newPassword) => {
    await delay();
    // TODO: Replace with: return api.post('/auth/change-password', { currentPassword, newPassword });
    return { data: { message: 'Password changed successfully' } };
  },

  refreshToken: async (refreshToken) => {
    await delay(200);
    // TODO: Replace with: return api.post('/auth/refresh', { refreshToken });
    return { data: { token: 'new_mock_jwt_token', refreshToken: 'new_mock_refresh_token' } };
  },

  getCurrentUser: async () => {
    await delay(300);
    // TODO: Replace with: return api.get('/auth/me');
    const stored = localStorage.getItem('user');
    return { data: stored ? JSON.parse(stored) : currentUser };
  },

  toggleTwoFactor: async (enabled) => {
    await delay();
    // TODO: Replace with: return api.post('/auth/2fa/toggle', { enabled });
    return { data: { twoFactorEnabled: enabled, qrCode: enabled ? 'mock_qr_code_url' : null } };
  },
};
