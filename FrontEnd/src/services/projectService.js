// projectService.js
import axios from 'axios';
import { mockProjects } from '../mock/projects';
import { generateId } from '../utils';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const api = axios.create({ baseURL: BASE_URL });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let _projects = [...mockProjects];
const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

export const projectService = {
  getAll: async (params = {}) => {
    await delay();
    // TODO: Replace with: return api.get('/projects', { params });
    let projects = [..._projects];
    if (params.archived !== undefined) projects = projects.filter(p => p.isArchived === params.archived);
    if (params.search) projects = projects.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
    return { data: { projects, total: projects.length } };
  },

  getById: async (id) => {
    await delay(300);
    // TODO: Replace with: return api.get(`/projects/${id}`);
    const project = _projects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    return { data: project };
  },

  create: async (data) => {
    await delay();
    // TODO: Replace with: return api.post('/projects', data);
    const project = { ...data, id: generateId(), progress: 0, totalTasks: 0, completedTasks: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isArchived: false };
    _projects = [project, ..._projects];
    return { data: project };
  },

  update: async (id, updates) => {
    await delay();
    // TODO: Replace with: return api.patch(`/projects/${id}`, updates);
    _projects = _projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p);
    return { data: _projects.find(p => p.id === id) };
  },

  delete: async (id) => {
    await delay();
    // TODO: Replace with: return api.delete(`/projects/${id}`);
    _projects = _projects.filter(p => p.id !== id);
    return { data: { message: 'Project deleted' } };
  },

  archive: async (id) => {
    await delay();
    // TODO: Replace with: return api.post(`/projects/${id}/archive`);
    _projects = _projects.map(p => p.id === id ? { ...p, isArchived: true } : p);
    return { data: { message: 'Project archived' } };
  },

  restore: async (id) => {
    await delay();
    // TODO: Replace with: return api.post(`/projects/${id}/restore`);
    _projects = _projects.map(p => p.id === id ? { ...p, isArchived: false } : p);
    return { data: { message: 'Project restored' } };
  },

  addMember: async (projectId, userId) => {
    await delay();
    // TODO: Replace with: return api.post(`/projects/${projectId}/members`, { userId });
    _projects = _projects.map(p => p.id === projectId ? { ...p, memberIds: [...p.memberIds, userId] } : p);
    return { data: { message: 'Member added' } };
  },

  removeMember: async (projectId, userId) => {
    await delay();
    // TODO: Replace with: return api.delete(`/projects/${projectId}/members/${userId}`);
    _projects = _projects.map(p => p.id === projectId ? { ...p, memberIds: p.memberIds.filter(id => id !== userId) } : p);
    return { data: { message: 'Member removed' } };
  },
};
