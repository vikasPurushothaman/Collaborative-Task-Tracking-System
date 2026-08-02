// App Constants
export const APP_NAME = 'TaskFlow';
export const APP_VERSION = '1.0.0';

export const TASK_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
  CANCELLED: 'cancelled',
};

export const TASK_PRIORITIES = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
};

export const PROJECT_STATUSES = {
  ACTIVE: 'active',
  PLANNING: 'planning',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  blocked: 'Blocked',
  cancelled: 'Cancelled',
};

export const PRIORITY_LABELS = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const STATUS_COLORS = {
  open: 'blue',
  in_progress: 'purple',
  completed: 'green',
  blocked: 'red',
  cancelled: 'gray',
};

export const PRIORITY_COLORS = {
  urgent: 'red',
  high: 'orange',
  medium: 'yellow',
  low: 'green',
};

export const CATEGORY_OPTIONS = [
  'Development', 'Design', 'Marketing', 'Analytics', 'DevOps',
  'Research', 'Content', 'Management', 'Other',
];

export const LABEL_OPTIONS = [
  'Feature', 'Bug Fix', 'Security', 'Performance', 'Documentation',
  'Infrastructure', 'Content', 'Report', 'Integration', 'Urgent',
];

export const TIMEZONE_OPTIONS = [
  'America/New_York', 'America/Los_Angeles', 'America/Chicago',
  'Europe/London', 'Europe/Paris', 'Asia/Kolkata', 'Asia/Tokyo',
  'Australia/Sydney', 'Pacific/Auckland',
];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
  { value: 'hi', label: 'हिन्दी' },
];

export const ITEMS_PER_PAGE = 10;

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl + K', description: 'Open Command Palette', category: 'Navigation' },
  { key: 'Ctrl + N', description: 'Create New Task', category: 'Tasks' },
  { key: 'Ctrl + /', description: 'Open Search', category: 'Navigation' },
  { key: 'G + D', description: 'Go to Dashboard', category: 'Navigation' },
  { key: 'G + T', description: 'Go to Tasks', category: 'Navigation' },
  { key: 'G + P', description: 'Go to Projects', category: 'Navigation' },
  { key: 'Ctrl + Shift + L', description: 'Toggle Dark Mode', category: 'UI' },
  { key: 'Escape', description: 'Close Modal/Dropdown', category: 'UI' },
  { key: 'Ctrl + S', description: 'Save Current Form', category: 'Forms' },
  { key: 'Ctrl + Z', description: 'Undo Last Action', category: 'Actions' },
];
