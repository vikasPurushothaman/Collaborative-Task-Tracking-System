// analyticsService.js
import { weeklyProductivity, monthlyCompleted, taskDistribution, priorityDistribution, userProductivity, burndownData, projectProgress, activityFeed, heatmapData } from '../mock/analytics';
const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

export const analyticsService = {
  getWeeklyProductivity: async () => { await delay(); return { data: weeklyProductivity }; },
  getMonthlyCompleted: async () => { await delay(); return { data: monthlyCompleted }; },
  getTaskDistribution: async () => { await delay(); return { data: taskDistribution }; },
  getPriorityDistribution: async () => { await delay(); return { data: priorityDistribution }; },
  getUserProductivity: async () => { await delay(); return { data: userProductivity }; },
  getBurndownData: async () => { await delay(); return { data: burndownData }; },
  getProjectProgress: async () => { await delay(); return { data: projectProgress }; },
  getActivityFeed: async () => { await delay(300); return { data: activityFeed }; },
  getHeatmapData: async () => { await delay(); return { data: heatmapData }; },
  getDashboardStats: async () => {
    await delay(400);
    return { data: { totalTasks: 85, completedToday: 5, overdue: 2, inProgress: 28, teamMembers: 8, activeProjects: 4, weeklyGrowth: 12.5, completionRate: 68 } };
  },
};
