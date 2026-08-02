// Mock Analytics Data
export const weeklyProductivity = [
  { day: 'Mon', completed: 8, created: 5, inProgress: 3 },
  { day: 'Tue', completed: 12, created: 8, inProgress: 6 },
  { day: 'Wed', completed: 7, created: 4, inProgress: 4 },
  { day: 'Thu', completed: 15, created: 10, inProgress: 8 },
  { day: 'Fri', completed: 10, created: 6, inProgress: 5 },
  { day: 'Sat', completed: 4, created: 2, inProgress: 1 },
  { day: 'Sun', completed: 2, created: 1, inProgress: 0 },
];

export const monthlyCompleted = [
  { month: 'Jan', completed: 45, target: 50 },
  { month: 'Feb', completed: 52, target: 50 },
  { month: 'Mar', completed: 61, target: 55 },
  { month: 'Apr', completed: 48, target: 55 },
  { month: 'May', completed: 70, target: 60 },
  { month: 'Jun', completed: 65, target: 60 },
  { month: 'Jul', completed: 58, target: 65 },
];

export const taskDistribution = [
  { name: 'Completed', value: 42, color: '#10b981' },
  { name: 'In Progress', value: 28, color: '#6172f3' },
  { name: 'Open', value: 18, color: '#f59e0b' },
  { name: 'Blocked', value: 7, color: '#ef4444' },
  { name: 'Cancelled', value: 5, color: '#94a3b8' },
];

export const priorityDistribution = [
  { name: 'Urgent', value: 15, color: '#ef4444' },
  { name: 'High', value: 35, color: '#f97316' },
  { name: 'Medium', value: 32, color: '#f59e0b' },
  { name: 'Low', value: 18, color: '#10b981' },
];

export const userProductivity = [
  { name: 'Alex J.', completed: 42, assigned: 48, score: 92 },
  { name: 'Sarah C.', completed: 58, assigned: 62, score: 95 },
  { name: 'Marcus W.', completed: 28, assigned: 35, score: 85 },
  { name: 'Priya P.', completed: 44, assigned: 48, score: 92 },
  { name: 'James O.', completed: 36, assigned: 40, score: 90 },
  { name: 'Emma W.', completed: 20, assigned: 25, score: 80 },
];

export const burndownData = [
  { sprint: 'Day 1', remaining: 80, ideal: 80 },
  { sprint: 'Day 2', remaining: 75, ideal: 72 },
  { sprint: 'Day 3', remaining: 68, ideal: 64 },
  { sprint: 'Day 4', remaining: 62, ideal: 56 },
  { sprint: 'Day 5', remaining: 55, ideal: 48 },
  { sprint: 'Day 6', remaining: 48, ideal: 40 },
  { sprint: 'Day 7', remaining: 42, ideal: 32 },
  { sprint: 'Day 8', remaining: 32, ideal: 24 },
  { sprint: 'Day 9', remaining: 28, ideal: 16 },
  { sprint: 'Day 10', remaining: 18, ideal: 8 },
  { sprint: 'Day 11', remaining: 10, ideal: 0 },
];

export const heatmapData = Array.from({ length: 53 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week,
    day,
    count: Math.floor(Math.random() * 8),
  }))
).flat();

export const projectProgress = [
  { name: 'TaskFlow Platform', progress: 68, tasks: 85, color: '#6172f3' },
  { name: 'Mobile App Redesign', progress: 45, tasks: 64, color: '#f43f5e' },
  { name: 'Marketing Campaign Q3', progress: 25, tasks: 42, color: '#10b981' },
  { name: 'API Integration V2', progress: 10, tasks: 30, color: '#f59e0b' },
  { name: 'Data Analytics Dashboard', progress: 100, tasks: 55, color: '#8b5cf6' },
];

export const activityFeed = [
  { id: 'a1', type: 'task_completed', userId: 'u2', taskId: 'task-002', message: 'completed "Implement JWT authentication"', time: '2026-07-25T16:00:00Z' },
  { id: 'a2', type: 'comment_added', userId: 'u1', taskId: 'task-001', message: 'commented on "Design new onboarding flow"', time: '2026-07-25T15:30:00Z' },
  { id: 'a3', type: 'task_created', userId: 'u4', taskId: 'task-006', message: 'created "Database performance optimization"', time: '2026-07-25T14:00:00Z' },
  { id: 'a4', type: 'status_changed', userId: 'u3', taskId: 'task-001', message: 'updated status of "Design new onboarding flow" to In Progress', time: '2026-07-25T13:00:00Z' },
  { id: 'a5', type: 'member_joined', userId: 'u6', message: 'joined the Marketing Campaign Q3 project', time: '2026-07-25T11:00:00Z' },
  { id: 'a6', type: 'task_assigned', userId: 'u1', taskId: 'task-004', message: 'assigned "Write API documentation" to Priya Patel', time: '2026-07-25T10:00:00Z' },
];
