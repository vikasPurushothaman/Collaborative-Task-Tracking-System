export const mockComments = [
  { id: 'c1', taskId: 'task-1', authorId: 'u2', content: 'I\'ve reviewed the initial designs and they look great. Just a few things to address regarding the mobile responsiveness.', createdAt: '2026-07-20T10:00:00Z', reactions: [{ emoji: '👍', userIds: ['u1', 'u3'] }, { emoji: '🎉', userIds: ['u4'] }], replies: [{ id: 'c1r1', authorId: 'u1', content: 'Thanks! Will fix the mobile breakpoints today.', createdAt: '2026-07-20T11:00:00Z', reactions: [] }] },
  { id: 'c2', taskId: 'task-1', authorId: 'u3', content: 'Could we also add dark mode support to this component? The design system supports it and it\'s on our roadmap.', createdAt: '2026-07-21T14:00:00Z', reactions: [{ emoji: '💡', userIds: ['u1', 'u2'] }], replies: [] },
  { id: 'c3', taskId: 'task-2', authorId: 'u5', content: 'The API endpoints are ready. I\'ve documented them in Swagger. Please check the /api/v1 path.', createdAt: '2026-07-22T09:00:00Z', reactions: [{ emoji: '🚀', userIds: ['u1'] }], replies: [] },
  { id: 'c4', taskId: 'task-3', authorId: 'u1', content: 'The CI/CD pipeline is now configured. All green! Docker builds are taking ~3 minutes which is acceptable.', createdAt: '2026-07-23T16:00:00Z', reactions: [{ emoji: '✅', userIds: ['u2', 'u5', 'u6'] }], replies: [] },
  { id: 'c5', taskId: 'task-4', authorId: 'u4', content: 'UI mockups are attached. @u1 please review the dashboard layout before we start development.', createdAt: '2026-07-24T11:00:00Z', reactions: [], replies: [] },
];

export const mockAttachments = [
  { id: 'a1', taskId: 'task-1', name: 'design-mockup-v2.fig', type: 'figma', size: 2480000, uploadedAt: '2026-07-20T09:00:00Z', uploadedBy: 'u3', url: '#' },
  { id: 'a2', taskId: 'task-1', name: 'requirements-doc.pdf', type: 'pdf', size: 341000, uploadedAt: '2026-07-18T14:00:00Z', uploadedBy: 'u1', url: '#' },
  { id: 'a3', taskId: 'task-2', name: 'api-spec.yaml', type: 'yaml', size: 15000, uploadedAt: '2026-07-22T08:00:00Z', uploadedBy: 'u5', url: '#' },
  { id: 'a4', taskId: 'task-3', name: 'pipeline-screenshot.png', type: 'image', size: 890000, uploadedAt: '2026-07-23T16:00:00Z', uploadedBy: 'u1', url: '#' },
];
