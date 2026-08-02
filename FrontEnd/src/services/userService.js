// userService.js
import { mockUsers } from '../mock/users';
import { generateId } from '../utils';
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));
let _users = [...mockUsers];

export const userService = {
  getAll: async () => { await delay(); return { data: { users: _users } }; },
  getById: async (id) => { await delay(300); const u = _users.find(u => u.id === id); if (!u) throw new Error('User not found'); return { data: u }; },
  update: async (id, updates) => { await delay(); _users = _users.map(u => u.id === id ? { ...u, ...updates } : u); return { data: _users.find(u => u.id === id) }; },
  delete: async (id) => { await delay(); _users = _users.filter(u => u.id !== id); return { data: { message: 'User deleted' } }; },
  uploadAvatar: async (id, file) => { await delay(1000); const url = URL.createObjectURL(file); _users = _users.map(u => u.id === id ? { ...u, avatar: url } : u); return { data: { avatar: url } }; },
  search: async (query) => { await delay(200); const q = query.toLowerCase(); return { data: { users: _users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) } }; },
  getActivityLog: async (id) => { await delay(); return { data: { activities: [] } }; },
};
