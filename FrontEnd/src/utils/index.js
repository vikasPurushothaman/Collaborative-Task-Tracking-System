// Utility functions
import { format, formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns';

export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  if (!date) return '—';
  try {
    return format(typeof date === 'string' ? parseISO(date) : date, fmt);
  } catch {
    return '—';
  }
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  try {
    return formatDistanceToNow(typeof date === 'string' ? parseISO(date) : date, { addSuffix: true });
  } catch {
    return '';
  }
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed' || status === 'cancelled') return false;
  return isBefore(typeof dueDate === 'string' ? parseISO(dueDate) : dueDate, new Date());
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

export const truncate = (str, len = 60) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '…' : str;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

export const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const groupBy = (array, key) =>
  array.reduce((acc, item) => {
    const k = typeof key === 'function' ? key(item) : item[key];
    (acc[k] = acc[k] || []).push(item);
    return acc;
  }, {});

export const sortBy = (array, key, dir = 'asc') => {
  return [...array].sort((a, b) => {
    const av = typeof key === 'function' ? key(a) : a[key];
    const bv = typeof key === 'function' ? key(b) : b[key];
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterTasks = (tasks, filters) => {
  return tasks.filter(task => {
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.projectId && filters.projectId !== 'all' && task.projectId !== filters.projectId) return false;
    if (filters.assigneeId && filters.assigneeId !== 'all' && task.assigneeId !== filters.assigneeId) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!task.title.toLowerCase().includes(q) && !task.description?.toLowerCase().includes(q)) return false;
    }
    return true;
  });
};

export const calculateProgress = (subtasks) => {
  if (!subtasks || subtasks.length === 0) return 0;
  const done = subtasks.filter(s => s.completed).length;
  return Math.round((done / subtasks.length) * 100);
};

export const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return { score: 0, label: '', color: '' };
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { score: 0, label: 'Too Weak', color: 'bg-danger-500' },
    { score: 1, label: 'Weak', color: 'bg-danger-400' },
    { score: 2, label: 'Fair', color: 'bg-warning-500' },
    { score: 3, label: 'Good', color: 'bg-yellow-400' },
    { score: 4, label: 'Strong', color: 'bg-success-500' },
    { score: 5, label: 'Very Strong', color: 'bg-success-600' },
  ];
  return levels[score] || levels[0];
};

export const cn = (...classes) => classes.filter(Boolean).join(' ');
