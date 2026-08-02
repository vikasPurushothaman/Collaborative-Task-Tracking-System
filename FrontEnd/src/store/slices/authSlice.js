import { createSlice } from '@reduxjs/toolkit';
import { currentUser } from '../../mock/users';

const stored = localStorage.getItem('user');
const initialState = {
  user: stored ? JSON.parse(stored) : currentUser,
  token: localStorage.getItem('token') || 'mock_token',
  isAuthenticated: true, // default true for mock
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => { state.user = action.payload; state.isAuthenticated = true; },
    setToken: (state, action) => { state.token = action.payload; },
    logout: (state) => { state.user = null; state.token = null; state.isAuthenticated = false; localStorage.removeItem('token'); localStorage.removeItem('user'); },
    updateUser: (state, action) => { state.user = { ...state.user, ...action.payload }; localStorage.setItem('user', JSON.stringify(state.user)); },
    setLoading: (state, action) => { state.isLoading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setUser, setToken, logout, updateUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
