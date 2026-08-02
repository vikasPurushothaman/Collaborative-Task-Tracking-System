// commentService.js
import { mockComments } from '../mock/comments';
import { generateId } from '../utils';
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));
let _comments = [...mockComments];

export const commentService = {
  getByTask: async (taskId) => { await delay(); return { data: _comments.filter(c => c.taskId === taskId) }; },
  create: async (data) => { await delay(); const c = { ...data, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), reactions: [], replies: [] }; _comments = [c, ..._comments]; return { data: c }; },
  update: async (id, content) => { await delay(); _comments = _comments.map(c => c.id === id ? { ...c, content, updatedAt: new Date().toISOString() } : c); return { data: _comments.find(c => c.id === id) }; },
  delete: async (id) => { await delay(); _comments = _comments.filter(c => c.id !== id); return { data: { message: 'Comment deleted' } }; },
  addReaction: async (id, emoji, userId) => { await delay(200); return { data: { message: 'Reaction added' } }; },
  addReply: async (parentId, data) => { await delay(); const reply = { ...data, id: generateId(), parentId, createdAt: new Date().toISOString(), reactions: [], replies: [] }; return { data: reply }; },
};
