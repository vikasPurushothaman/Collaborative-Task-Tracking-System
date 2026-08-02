export const mockNotifications = [
  { id: 'n1', title: 'Task Assigned', message: 'Alex assigned you "Redesign the authentication flow"', type: 'task', icon: 'task', priority: 'high', isRead: false, link: '/tasks/task-1', createdAt: '2026-07-25T10:00:00Z' },
  { id: 'n2', title: 'Comment Added', message: 'Jordan commented on "Build API endpoints for task management"', type: 'comment', icon: 'comment', priority: 'normal', isRead: false, link: '/tasks/task-2', createdAt: '2026-07-25T09:30:00Z' },
  { id: 'n3', title: 'Task Overdue', message: '"Set up CI/CD pipeline" was due yesterday', type: 'warning', icon: 'warning', priority: 'urgent', isRead: false, link: '/tasks/task-3', createdAt: '2026-07-25T09:00:00Z' },
  { id: 'n4', title: 'Project Updated', message: 'TaskFlow Platform project was updated by Sarah', type: 'project', icon: 'project', priority: 'normal', isRead: true, link: '/projects/p1', createdAt: '2026-07-24T18:00:00Z' },
  { id: 'n5', title: 'You were mentioned', message: 'Marcus mentioned you in a comment: "@you what do you think?"', type: 'mention', icon: 'mention', priority: 'high', isRead: false, link: '/tasks/task-5', createdAt: '2026-07-24T17:00:00Z' },
  { id: 'n6', title: 'Sprint Started', message: 'Sprint 12 has started for the TaskFlow Platform project', type: 'system', icon: 'system', priority: 'normal', isRead: true, link: '/projects/p1', createdAt: '2026-07-24T09:00:00Z' },
  { id: 'n7', title: 'Task Completed', message: '"Create user authentication service" was marked as completed', type: 'success', icon: 'success', priority: 'normal', isRead: true, link: '/tasks/task-6', createdAt: '2026-07-23T16:00:00Z' },
  { id: 'n8', title: 'New Team Member', message: 'Emily Chen joined the Frontend Core team', type: 'team', icon: 'team', priority: 'low', isRead: true, link: '/teams/t1', createdAt: '2026-07-23T10:00:00Z' },
];
