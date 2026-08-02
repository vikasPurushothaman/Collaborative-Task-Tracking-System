import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Award, CheckSquare, FolderOpen, Users, Star, Zap } from 'lucide-react';
import { Avatar, ProgressBar, Badge } from '../../components/ui/index';
import { mockTasks } from '../../mock/tasks';
import { mockProjects } from '../../mock/projects';
import { mockTeams } from '../../mock/teams';
import { formatDate } from '../../utils';

export default function ProfilePage() {
  const { user } = useSelector(s => s.auth);
  if (!user) return null;

  const assignedTasks = mockTasks.filter(t => t.assigneeId === user.id);
  const completedTasks = assignedTasks.filter(t => t.status === 'completed');
  const userProjects = mockProjects.filter(p => p.memberIds.includes(user.id));
  const userTeams = mockTeams.filter(t => t.memberIds.includes(user.id));

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-brand-600 to-brand-800 relative">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-brand-300 via-transparent to-accent-500" />
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div className="relative">
              <Avatar src={user.avatar} name={user.name} size="xl" online={user.isOnline} />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center shadow hover:bg-brand-700 transition-colors">
                <Edit2 size={12} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/profile/edit" className="btn-secondary text-sm gap-1.5"><Edit2 size={14} /> Edit Profile</Link>
              <Link to="/profile/change-password" className="btn-ghost text-sm">Change Password</Link>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">{user.name}</h1>
              <Badge variant={user.role === 'owner' ? 'brand' : user.role === 'admin' ? 'warning' : 'surface'} className="text-xs capitalize">{user.role}</Badge>
              {user.emailVerified && <span className="text-success-500 text-xs">✓ Verified</span>}
            </div>
            <p className="text-surface-500 text-sm">{user.title} · {user.department}</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-2">{user.bio}</p>
            <p className="text-xs text-surface-400 mt-1">{user.email} · {user.phone}</p>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.skills?.map(s => <span key={s} className="badge-brand text-xs">{s}</span>)}
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: CheckSquare, label: 'Total Tasks', value: assignedTasks.length, color: 'text-brand-500' },
          { icon: CheckSquare, label: 'Completed', value: completedTasks.length, color: 'text-success-500' },
          { icon: FolderOpen, label: 'Projects', value: userProjects.length, color: 'text-purple-500' },
          { icon: Users, label: 'Teams', value: userTeams.length, color: 'text-orange-500' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-4 text-center">
            <s.icon size={20} className={`mx-auto ${s.color} mb-1`} />
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{s.value}</p>
            <p className="text-xs text-surface-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Productivity */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-brand-500" />
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">Productivity Score</h3>
          </div>
          <div className="text-center py-4">
            <div className="relative inline-block">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="10" fill="none" className="dark:stroke-surface-700" />
                <circle cx="50" cy="50" r="40" stroke="#6172f3" strokeWidth="10" fill="none" strokeDasharray={`${user.productivity * 2.51} ${251 - user.productivity * 2.51}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-surface-900 dark:text-surface-100">{user.productivity}%</span>
              </div>
            </div>
            <p className="text-surface-500 text-sm mt-2">Completion Rate</p>
          </div>
          <ProgressBar value={completedTasks.length} max={assignedTasks.length || 1} color="brand" showLabel className="mt-2" />
        </div>

        {/* Badges */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-yellow-500" />
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {user.badges?.map(badge => (
              <div key={badge} className="flex items-center gap-2 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800/30">
                <span className="text-lg">🏆</span>
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{badge}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-surface-400 mt-3">Member since {formatDate(user.joinedAt)}</p>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100">Assigned Tasks</h3>
          <Link to="/tasks" className="text-xs text-brand-600 hover:underline">View all</Link>
        </div>
        <div className="space-y-2">
          {assignedTasks.slice(0, 5).map(t => (
            <Link key={t.id} to={`/tasks/${t.id}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
              <div className={`w-2 h-2 rounded-full ${t.priority === 'urgent' ? 'bg-red-500' : t.priority === 'high' ? 'bg-orange-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <span className="flex-1 text-sm text-surface-800 dark:text-surface-200 truncate">{t.title}</span>
              <Badge variant={t.status} className="text-[10px]">{t.status}</Badge>
            </Link>
          ))}
          {assignedTasks.length === 0 && <p className="text-sm text-surface-400 text-center py-4">No tasks assigned</p>}
        </div>
      </div>
    </div>
  );
}
