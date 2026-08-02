import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  CheckSquare, Clock, AlertTriangle, TrendingUp, Users, FolderOpen, Zap, Star
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import { taskService } from '../../services/taskService';
import { StatCard, SkeletonCard, Avatar, ProgressBar, Badge } from '../../components/ui/index';
import { mockUsers } from '../../mock/users';
import { mockProjects } from '../../mock/projects';
import { mockTasks } from '../../mock/tasks';
import { activityFeed, weeklyProductivity, taskDistribution } from '../../mock/analytics';
import { formatRelativeTime, formatDate, isOverdue } from '../../utils';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../constants';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function DashboardPage() {
  const { user } = useSelector(s => s.auth);

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: analyticsService.getDashboardStats,
    select: d => d.data,
  });

  const { data: weeklyData } = useQuery({
    queryKey: ['weekly-productivity'],
    queryFn: analyticsService.getWeeklyProductivity,
    select: d => d.data,
  });

  const { data: pieData } = useQuery({
    queryKey: ['task-distribution'],
    queryFn: analyticsService.getTaskDistribution,
    select: d => d.data,
  });

  const onlineUsers = mockUsers.filter(u => u.isOnline);
  const myTasks = mockTasks.filter(t => t.assigneeId === user?.id).slice(0, 5);
  const overdueTasks = mockTasks.filter(t => isOverdue(t.dueDate, t.status)).slice(0, 3);
  const recentProjects = mockProjects.filter(p => !p.isArchived).slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div {...fadeUp(0)} className="relative bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white rounded-full translate-y-1/2" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-brand-200 mt-1 text-sm">
              You have <span className="text-white font-semibold">{statsData?.inProgress || 0} tasks in progress</span> and <span className="text-white font-semibold">{statsData?.overdue || 0} overdue</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center min-w-[80px]">
              <p className="text-2xl font-bold text-white">{statsData?.completionRate || 0}%</p>
              <p className="text-xs text-brand-200 mt-0.5">Completion</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center min-w-[80px]">
              <p className="text-2xl font-bold text-white">{statsData?.completedToday || 0}</p>
              <p className="text-xs text-brand-200 mt-0.5">Done Today</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 mt-4 flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-xs text-brand-200 mb-1">
              <span>Weekly Goal</span>
              <span>68%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Tasks', value: statsData?.totalTasks ?? '—', icon: CheckSquare, color: 'brand', trend: 8, subtitle: 'All projects' },
          { title: 'In Progress', value: statsData?.inProgress ?? '—', icon: TrendingUp, color: 'purple', trend: 12, subtitle: 'Active work' },
          { title: 'Overdue', value: statsData?.overdue ?? '—', icon: AlertTriangle, color: 'danger', trend: -5, subtitle: 'Need attention' },
          { title: 'Team Members', value: statsData?.teamMembers ?? '—', icon: Users, color: 'success', subtitle: `${onlineUsers.length} online` },
        ].map((stat, i) => (
          <motion.div key={stat.title} {...fadeUp(0.1 + i * 0.05)}>
            <StatCard {...stat} loading={statsLoading} />
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Productivity */}
        <motion.div {...fadeUp(0.2)} className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Weekly Productivity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData || weeklyProductivity} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--tooltip-bg, #1e293b)', border: 'none', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="inProgress" fill="#6172f3" radius={[4, 4, 0, 0]} name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Distribution */}
        <motion.div {...fadeUp(0.25)} className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData || taskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {(pieData || taskDistribution).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {(pieData || taskDistribution).map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-surface-600 dark:text-surface-400">{d.name}</span>
                </div>
                <span className="font-medium text-surface-900 dark:text-surface-100">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: My Tasks, Activity, Team Online, Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* My Assigned Tasks */}
        <motion.div {...fadeUp(0.3)} className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">My Tasks</h3>
            <a href="/tasks" className="text-xs text-brand-600 hover:underline">View all →</a>
          </div>
          {myTasks.length === 0 ? (
            <div className="text-center py-8 text-surface-400">
              <CheckSquare size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No tasks assigned to you</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myTasks.map(task => (
                <a
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors group"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${task.priority === 'urgent' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-surface-400' : 'text-surface-900 dark:text-surface-100'}`}>{task.title}</p>
                    <p className="text-xs text-surface-400 mt-0.5">Due {formatDate(task.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={task.status}>{STATUS_LABELS[task.status] || task.status}</Badge>
                    {isOverdue(task.dueDate, task.status) && <AlertTriangle size={12} className="text-danger-500" />}
                  </div>
                </a>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Team Online */}
          <motion.div {...fadeUp(0.35)} className="card p-5">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3 text-sm">Team Online</h3>
            <div className="space-y-2.5">
              {onlineUsers.slice(0, 5).map(u => (
                <div key={u.id} className="flex items-center gap-2.5">
                  <Avatar src={u.avatar} name={u.name} size="sm" online={u.isOnline} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-surface-900 dark:text-surface-100 truncate">{u.name}</p>
                    <p className="text-[11px] text-surface-400 truncate">{u.title}</p>
                  </div>
                </div>
              ))}
              {onlineUsers.length === 0 && <p className="text-xs text-surface-400">No one online right now</p>}
            </div>
          </motion.div>

          {/* Active Projects */}
          <motion.div {...fadeUp(0.4)} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">Active Projects</h3>
              <a href="/projects" className="text-xs text-brand-600 hover:underline">All →</a>
            </div>
            <div className="space-y-3">
              {recentProjects.map(p => (
                <a key={p.id} href={`/projects/${p.id}`} className="block group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.icon}</span>
                      <span className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate group-hover:text-brand-600 transition-colors">{p.name}</span>
                    </div>
                    <span className="text-xs text-surface-400 font-medium">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} color="brand" size="sm" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div {...fadeUp(0.45)} className="card p-5">
        <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activityFeed.map((act, i) => {
            const actUser = mockUsers.find(u => u.id === act.userId);
            return (
              <div key={act.id} className="flex items-start gap-3">
                <Avatar src={actUser?.avatar} name={actUser?.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    <span className="font-medium text-surface-900 dark:text-surface-100">{actUser?.name?.split(' ')[0]}</span>
                    {' '}{act.message}
                  </p>
                  <p className="text-xs text-surface-400 mt-0.5">{formatRelativeTime(act.time)}</p>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
