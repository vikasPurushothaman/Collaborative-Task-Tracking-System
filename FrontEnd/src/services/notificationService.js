// notificationService.js
import { mockNotifications } from '../mock/notifications';
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));
let _notifs = [...mockNotifications];

export const notificationService = {
  getAll: async () => { await delay(); return { data: { notifications: _notifs, unreadCount: _notifs.filter(n => !n.isRead).length } }; },
  markRead: async (id) => { await delay(200); _notifs = _notifs.map(n => n.id === id ? { ...n, isRead: true } : n); return { data: { message: 'Marked as read' } }; },
  markAllRead: async () => { await delay(); _notifs = _notifs.map(n => ({ ...n, isRead: true })); return { data: { message: 'All marked as read' } }; },
  delete: async (id) => { await delay(); _notifs = _notifs.filter(n => n.id !== id); return { data: { message: 'Notification deleted' } }; },
  deleteAll: async () => { await delay(); _notifs = []; return { data: { message: 'All notifications cleared' } }; },
};
