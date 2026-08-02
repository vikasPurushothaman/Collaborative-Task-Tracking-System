// taskService.js - Replace Promise.resolve with real API calls later
import axios from 'axios';
import { mockTasks } from '../mock/tasks';
import { generateId } from '../utils';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let _tasks = [...mockTasks];
const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

export const taskService = {
  getAll: async (params = {}) => {
    await delay();
    // TODO: Replace with: return api.get('/tasks', { params });
    let tasks = [..._tasks];
    if (params.status && params.status !== 'all') tasks = tasks.filter(t => t.status === params.status);
    if (params.priority && params.priority !== 'all') tasks = tasks.filter(t => t.priority === params.priority);
    if (params.projectId) tasks = tasks.filter(t => t.projectId === params.projectId);
    if (params.assigneeId) tasks = tasks.filter(t => t.assigneeId === params.assigneeId);
    if (params.search) {
      const q = params.search.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    const total = tasks.length;
    const page = params.page || 1;
    const limit = params.limit || 10;
    const data = tasks.slice((page - 1) * limit, page * limit);
    return { data: { tasks: data, total, page, limit, totalPages: Math.ceil(total / limit) } };
  },

  getById: async (id) => {
    await delay(300);
    // TODO: Replace with: return api.get(`/tasks/${id}`);
    const task = _tasks.find(t => t.id === id);
    if (!task) throw new Error('Task not found');
    return { data: task };
  },

  create: async (taskData) => {
    await delay();
    // TODO: Replace with: return api.post('/tasks', taskData);
    const newTask = { ...taskData, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1, history: [] };
    _tasks = [newTask, ..._tasks];
    return { data: newTask };
  },

  update: async (id, updates) => {
    await delay();
    // TODO: Replace with: return api.patch(`/tasks/${id}`, updates);
    _tasks = _tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString(), version: (t.version || 1) + 1 } : t);
    return { data: _tasks.find(t => t.id === id) };
  },

  delete: async (id) => {
    await delay();
    // TODO: Replace with: return api.delete(`/tasks/${id}`);
    _tasks = _tasks.filter(t => t.id !== id);
    return { data: { message: 'Task deleted' } };
  },

  bulkDelete: async (ids) => {
    await delay();
    // TODO: Replace with: return api.post('/tasks/bulk-delete', { ids });
    _tasks = _tasks.filter(t => !ids.includes(t.id));
    return { data: { message: `${ids.length} tasks deleted` } };
  },

  bulkUpdate: async (ids, updates) => {
    await delay();
    // TODO: Replace with: return api.post('/tasks/bulk-update', { ids, updates });
    _tasks = _tasks.map(t => ids.includes(t.id) ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t);
    return { data: { message: `${ids.length} tasks updated` } };
  },

  archive: async (id) => {
    await delay();
    // TODO: Replace with: return api.post(`/tasks/${id}/archive`);
    _tasks = _tasks.map(t => t.id === id ? { ...t, isArchived: true } : t);
    return { data: { message: 'Task archived' } };
  },

  restore: async (id) => {
    await delay();
    // TODO: Replace with: return api.post(`/tasks/${id}/restore`);
    _tasks = _tasks.map(t => t.id === id ? { ...t, isArchived: false } : t);
    return { data: { message: 'Task restored' } };
  },

  duplicate: async (id) => {
    await delay();
    // TODO: Replace with: return api.post(`/tasks/${id}/duplicate`);
    const original = _tasks.find(t => t.id === id);
    if (!original) throw new Error('Task not found');
    const copy = { ...original, id: generateId(), title: `${original.title} (Copy)`, status: 'open', createdAt: new Date().toISOString() };
    _tasks = [copy, ..._tasks];
    return { data: copy };
  },

  toggleFavorite: async (id) => {
    await delay(200);
    // TODO: Replace with: return api.post(`/tasks/${id}/favorite`);
    _tasks = _tasks.map(t => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t);
    return { data: _tasks.find(t => t.id === id) };
  },

  getStats: async () => {
    await delay(300);
    // TODO: Replace with: return api.get('/tasks/stats');
    return {
      data: {
        total: _tasks.length,
        open: _tasks.filter(t => t.status === 'open').length,
        inProgress: _tasks.filter(t => t.status === 'in_progress').length,
        completed: _tasks.filter(t => t.status === 'completed').length,
        blocked: _tasks.filter(t => t.status === 'blocked').length,
        cancelled: _tasks.filter(t => t.status === 'cancelled').length,
        overdue: _tasks.filter(t => t.dueDate < new Date().toISOString().split('T')[0] && !['completed','cancelled'].includes(t.status)).length,
      }
    };
  },
};
