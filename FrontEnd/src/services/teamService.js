// teamService.js
import { mockTeams } from '../mock/teams';
import { generateId } from '../utils';
const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));
let _teams = [...mockTeams];

export const teamService = {
  getAll: async () => { await delay(); return { data: { teams: _teams } }; },
  getById: async (id) => { await delay(300); const t = _teams.find(t => t.id === id); if (!t) throw new Error('Team not found'); return { data: t }; },
  create: async (data) => { await delay(); const team = { ...data, id: generateId(), createdAt: new Date().toISOString(), activeTasks: 0, completedTasks: 0 }; _teams = [team, ..._teams]; return { data: team }; },
  update: async (id, updates) => { await delay(); _teams = _teams.map(t => t.id === id ? { ...t, ...updates } : t); return { data: _teams.find(t => t.id === id) }; },
  delete: async (id) => { await delay(); _teams = _teams.filter(t => t.id !== id); return { data: { message: 'Team deleted' } }; },
  addMember: async (teamId, userId, role = 'member') => { await delay(); _teams = _teams.map(t => t.id === teamId ? { ...t, memberIds: [...t.memberIds, userId] } : t); return { data: { message: 'Member added' } }; },
  removeMember: async (teamId, userId) => { await delay(); _teams = _teams.map(t => t.id === teamId ? { ...t, memberIds: t.memberIds.filter(id => id !== userId) } : t); return { data: { message: 'Member removed' } }; },
  inviteMember: async (teamId, email) => { await delay(); return { data: { message: `Invitation sent to ${email}` } }; },
};
