import { useParams, Link } from 'react-router-dom';
import { mockTeams } from '../../mock/teams';
import { mockUsers } from '../../mock/users';
import { mockTasks } from '../../mock/tasks';
import { Avatar, Badge } from '../../components/ui/index';
import { ArrowLeft, Lock, Users, CheckSquare } from 'lucide-react';

export default function TeamDetailPage() {
  const { id } = useParams();
  const team = mockTeams.find(t => t.id === id);
  if (!team) return <div className="text-center py-12 text-surface-500">Team not found</div>;
  const members = mockUsers.filter(u => team.memberIds.includes(u.id));
  const tasks = mockTasks.filter(t => t.teamId === id).slice(0, 5);

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <Link to="/teams" className="btn-ghost gap-1.5 text-sm inline-flex"><ArrowLeft size={14} /> Teams</Link>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: team.color + '20' }}>{team.icon}</div>
          <div>
            <div className="flex items-center gap-2"><h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">{team.name}</h1>{team.isPrivate && <Lock size={14} className="text-surface-400" />}</div>
            <p className="text-surface-500 text-sm">{team.memberIds.length} members · {team.activeTasks} active tasks</p>
          </div>
        </div>
        <p className="text-surface-600 dark:text-surface-400 text-sm">{team.description}</p>
        {team.tags?.length > 0 && <div className="flex gap-2 mt-3">{team.tags.map(t => <span key={t} className="badge-surface text-xs px-2 py-0.5 rounded-full">{t}</span>)}</div>}
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-3 text-surface-900 dark:text-surface-100">Members</h3>
        <div className="space-y-3">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-3">
              <Avatar src={m.avatar} name={m.name} size="sm" online={m.isOnline} />
              <div className="flex-1"><p className="text-sm font-medium text-surface-900 dark:text-surface-100">{m.name}</p><p className="text-xs text-surface-400">{m.title}</p></div>
              <Badge variant={team.ownerId === m.id ? 'brand' : team.admins.includes(m.id) ? 'warning' : 'surface'} className="text-[10px]">
                {team.ownerId === m.id ? 'Owner' : team.admins.includes(m.id) ? 'Admin' : 'Member'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-semibold mb-3 text-surface-900 dark:text-surface-100">Recent Tasks</h3>
        <div className="space-y-2">
          {tasks.map(t => <Link key={t.id} to={`/tasks/${t.id}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"><CheckSquare size={13} className="text-surface-400" /><span className="flex-1 text-sm text-surface-800 dark:text-surface-200 truncate">{t.title}</span><Badge variant={t.status} className="text-[10px]">{t.status}</Badge></Link>)}
          {tasks.length === 0 && <p className="text-sm text-surface-400 text-center py-4">No tasks</p>}
        </div>
      </div>
    </div>
  );
}
