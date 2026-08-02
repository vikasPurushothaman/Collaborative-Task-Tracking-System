import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, FolderOpen, CheckSquare, BarChart3, Shield, Activity } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { StatCard } from '../../components/ui/index';
import { mockUsers } from '../../mock/users';
import { mockProjects } from '../../mock/projects';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, Badge } from '../../components/ui/index';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: analyticsService.getDashboardStats, select: d => d.data });
  const { data: userProd } = useQuery({ queryKey: ['analytics-users'], queryFn: analyticsService.getUserProductivity, select: d => d.data });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-brand-600 rounded-xl flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Admin Panel</h1>
          <p className="text-sm text-surface-500">System management & oversight</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Users', value: mockUsers.length, icon: Users, color: 'brand' },
          { title: 'Active Projects', value: stats?.activeProjects || 0, icon: FolderOpen, color: 'success' },
          { title: 'Total Tasks', value: stats?.totalTasks || 0, icon: CheckSquare, color: 'warning' },
          { title: 'Completion Rate', value: `${stats?.completionRate || 0}%`, icon: BarChart3, color: 'purple' },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100">All Users</h3>
          <Link to="/admin/users" className="text-xs text-brand-600 hover:underline">Manage Users →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700 text-left">
                <th className="pb-2 text-xs font-semibold text-surface-500 uppercase">User</th>
                <th className="pb-2 text-xs font-semibold text-surface-500 uppercase hidden sm:table-cell">Role</th>
                <th className="pb-2 text-xs font-semibold text-surface-500 uppercase hidden md:table-cell">Department</th>
                <th className="pb-2 text-xs font-semibold text-surface-500 uppercase hidden lg:table-cell">Email Verified</th>
                <th className="pb-2 text-xs font-semibold text-surface-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
              {mockUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Avatar src={u.avatar} name={u.name} size="xs" online={u.isOnline} />
                      <div>
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{u.name}</p>
                        <p className="text-xs text-surface-400 hidden sm:block">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell"><Badge variant={u.role === 'owner' ? 'brand' : u.role === 'admin' ? 'warning' : 'surface'} className="text-[10px] capitalize">{u.role}</Badge></td>
                  <td className="py-3 pr-4 hidden md:table-cell text-sm text-surface-500">{u.department}</td>
                  <td className="py-3 pr-4 hidden lg:table-cell"><span className={`text-xs ${u.emailVerified ? 'text-success-600' : 'text-surface-400'}`}>{u.emailVerified ? '✓ Verified' : 'Unverified'}</span></td>
                  <td className="py-3"><span className={`inline-block w-2 h-2 rounded-full ${u.isOnline ? 'bg-success-500' : 'bg-surface-300'}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Productivity Chart */}
      <div className="card p-5">
        <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">User Productivity Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={userProd || []} barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#e2e8f0', fontSize: '12px' }} />
            <Bar dataKey="score" fill="#6172f3" radius={[4,4,0,0]} name="Score %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
