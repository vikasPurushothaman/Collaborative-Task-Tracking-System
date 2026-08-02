export const mockTeams = [
  {
    id: 't1', name: 'Frontend Core', icon: '⚡', color: '#6172f3', description: 'Building amazing user interfaces and experiences', isPrivate: false, ownerId: 'u1', admins: ['u1', 'u2'], memberIds: ['u1', 'u2', 'u3', 'u4'], projectIds: ['p1', 'p2'], activeTasks: 14, completedTasks: 42, tags: ['React', 'TypeScript', 'Tailwind'], createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 't2', name: 'Backend API', icon: '🔧', color: '#10b981', description: 'Designing and maintaining robust REST APIs', isPrivate: false, ownerId: 'u1', admins: ['u1', 'u5'], memberIds: ['u1', 'u5', 'u6', 'u7'], projectIds: ['p1', 'p3'], activeTasks: 18, completedTasks: 63, tags: ['Node.js', 'PostgreSQL', 'Docker'], createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 't3', name: 'Design System', icon: '🎨', color: '#8b5cf6', description: 'Creating visual consistency across all products', isPrivate: false, ownerId: 'u3', admins: ['u3'], memberIds: ['u3', 'u8'], projectIds: ['p2'], activeTasks: 8, completedTasks: 21, tags: ['Figma', 'Design Tokens', 'Accessibility'], createdAt: '2025-02-15T09:00:00Z',
  },
  {
    id: 't4', name: 'DevOps & Infra', icon: '☁️', color: '#f59e0b', description: 'Keeping the lights on and infrastructure running', isPrivate: true, ownerId: 'u5', admins: ['u5'], memberIds: ['u5', 'u9'], projectIds: ['p3'], activeTasks: 6, completedTasks: 18, tags: ['AWS', 'Kubernetes', 'Terraform'], createdAt: '2025-03-01T09:00:00Z',
  },
];
