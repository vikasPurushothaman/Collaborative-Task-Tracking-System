import { createSlice } from '@reduxjs/toolkit';
import { mockNotifications } from '../../mock/notifications';

const initialState = {
  items: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.isRead).length,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markRead: (state, action) => {
      const n = state.items.find(i => i.id === action.payload);
      if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
    },
    markAllRead: (state) => {
      state.items.forEach(n => { n.isRead = true; });
      state.unreadCount = 0;
    },
    deleteNotification: (state, action) => {
      const n = state.items.find(i => i.id === action.payload);
      if (n && !n.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearAll: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
  },
});

export const { markRead, markAllRead, deleteNotification, clearAll, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
