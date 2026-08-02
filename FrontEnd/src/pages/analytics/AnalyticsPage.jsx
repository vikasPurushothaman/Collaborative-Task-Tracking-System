import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../../services/analyticsService';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';
import { StatCard, Loader } from '../../components/ui/index';
import { TrendingUp, CheckSquare, Users, BarChart3, Zap } from 'lucide-react';

const COLORS = ['#6172f3', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { data: weekly } = useQuery({ queryKey: ['analytics-weekly'], queryFn: analyticsService.getWeeklyProductivity, select: d => d.data });
  const { data: monthly } = useQuery({ queryKey: ['analytics-monthly'], queryFn: analyticsService.getMonthlyCompleted, select: d => d.data });
  const { data: dist } = useQuery({ queryKey: ['analytics-dist'], queryFn: analyticsService.getTaskDistribution, select: d => d.data });
  const { data: userProd } = useQuery({ queryKey: ['analytics-users'], queryFn: analyticsService.getUserProductivity, select: d => d.data });
  const { data: burndown } = useQuery({ queryKey: ['analytics-burndown'], queryFn: analyticsService.getBurndownData, select: d => d.data });
  const { data: projProg } = useQuery({ queryKey: ['analytics-projects'], queryFn: analyticsService.getProjectProgress, select: d => d.data });
  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: analyticsService.getDashboardStats, select: d => d.data });

  const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Analytics</h1>
        <p className="text-sm text-surface-500">Insights into your team's productivity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div {...fadeUp(0)}><StatCard title="Completion Rate" value={`${stats?.completionRate || 0}%`} icon={TrendingUp} color="brand" trend={5} /></motion.div>
        <motion.div {...fadeUp(0.05)}><StatCard title="Tasks This Week" value={stats?.completedToday * 7 || 0} icon={CheckSquare} color="success" trend={12} /></motion.div>
        <motion.div {...fadeUp(0.1)}><StatCard title="Active Members" value={stats?.teamMembers || 0} icon={Users} color="purple" /></motion.div>
        <motion.div {...fadeUp(0.15)}><StatCard title="Active Projects" value={stats?.activeProjects || 0} icon={BarChart3} color="warning" /></motion.div>
      </div>

      {/* Weekly + Monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp(0.2)} className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Weekly Productivity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly || []} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="completed" fill="#10b981" radius={[4,4,0,0]} name="Completed" />
              <Bar dataKey="created" fill="#6172f3" radius={[4,4,0,0]} name="Created" />
              <Bar dataKey="inProgress" fill="#f59e0b" radius={[4,4,0,0]} name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp(0.25)} className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Monthly Completion Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly || []}>
              <defs>
                <linearGradient id="cgCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6172f3" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6172f3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="completed" stroke="#6172f3" fill="url(#cgCompleted)" strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Distribution + User Productivity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div {...fadeUp(0.3)} className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={dist || []} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {(dist || []).map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {(dist || []).map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /><span className="text-surface-600 dark:text-surface-400">{d.name}</span></div>
                <span className="font-medium text-surface-900 dark:text-surface-100">{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.35)} className="lg:col-span-2 card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">User Productivity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={userProd || []} layout="vertical" barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="completed" fill="#10b981" radius={[0,4,4,0]} name="Completed" />
              <Bar dataKey="assigned" fill="#6172f3" radius={[0,4,4,0]} name="Assigned" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Burndown + Project Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp(0.4)} className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Sprint Burndown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={burndown || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="sprint" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="remaining" stroke="#ef4444" strokeWidth={2} name="Remaining" dot={false} />
              <Line type="monotone" dataKey="ideal" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" name="Ideal" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp(0.45)} className="card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">Project Progress</h3>
          <div className="space-y-3">
            {(projProg || []).map(p => (
              <div key={p.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-surface-700 dark:text-surface-300 truncate">{p.name}</span>
                  <span className="font-medium text-surface-900 dark:text-surface-100 ml-2">{p.progress}%</span>
                </div>
                <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.progress}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
