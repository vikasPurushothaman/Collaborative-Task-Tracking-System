import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { mockUsers } from '../../mock/users';
import { mockTasks } from '../../mock/tasks';
import { Avatar, Badge, ProgressBar, Loader } from '../../components/ui/index';
import { formatDate } from '../../utils';
import { ArrowLeft, Users, CheckSquare, Calendar, DollarSign } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id),
    select: d => d.data,
  });

  if (isLoading) return <Loader center />;
  if (!project) return <div className="text-center py-12 text-surface-500">Project not found</div>;

  const members = mockUsers.filter(u => project.memberIds.includes(u.id));
  const tasks = mockTasks.filter(t => t.projectId === id);
  const completed = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/projects" className="btn-ghost gap-1.5 text-sm"><ArrowLeft size={14} /> Projects</Link>
      </div>

      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: project.color + '20' }}>{project.icon}</div>
          <div className="flex-1">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">{project.name}</h1>
                <p className="text-surface-500 text-sm mt-0.5">{project.category}</p>
              </div>
              <Badge variant={project.status === 'active' ? 'success' : 'surface'} className="text-xs">{project.status}</Badge>
            </div>
            <p className="text-surface-600 dark:text-surface-400 text-sm mt-2">{project.description}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: CheckSquare, label: 'Tasks', value: `${completed}/${project.totalTasks}` },
            { icon: Calendar, label: 'Due', value: formatDate(project.dueDate) },
            { icon: Users, label: 'Members', value: project.memberIds.length },
            { icon: DollarSign, label: 'Budget', value: `$${(project.budget / 1000).toFixed(0)}K` },
          ].map(s => (
            <div key={s.label} className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-3 text-center">
              <s.icon size={16} className="mx-auto text-surface-400 mb-1" />
              <p className="text-lg font-bold text-surface-900 dark:text-surface-100">{s.value}</p>
              <p className="text-xs text-surface-400">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-sm mb-1"><span className="text-surface-600 dark:text-surface-400">Overall Progress</span><span className="font-semibold text-surface-900 dark:text-surface-100">{project.progress}%</span></div>
          <ProgressBar value={project.progress} color="gradient" size="lg" />
        </div>
      </div>

      {/* Members */}
      <div className="card p-5">
        <h3 className="font-semibold mb-3 text-surface-900 dark:text-surface-100">Team Members</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
              <Avatar src={m.avatar} name={m.name} size="sm" online={m.isOnline} />
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{m.name}</p>
                <p className="text-xs text-surface-400">{m.title}</p>
              </div>
              <Badge variant={m.role === 'owner' ? 'brand' : 'surface'} className="ml-auto text-[10px]">{m.role}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100">Tasks</h3>
          <Link to={`/tasks?projectId=${id}`} className="text-xs text-brand-600 hover:underline">View all</Link>
        </div>
        <div className="space-y-2">
          {tasks.slice(0, 5).map(t => (
            <Link key={t.id} to={`/tasks/${t.id}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'urgent' ? 'bg-red-500' : t.priority === 'high' ? 'bg-orange-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              <span className="flex-1 text-sm text-surface-800 dark:text-surface-200 truncate">{t.title}</span>
              <Badge variant={t.status} className="text-[10px]">{t.status}</Badge>
            </Link>
          ))}
          {tasks.length === 0 && <p className="text-sm text-surface-400 text-center py-4">No tasks in this project</p>}
        </div>
      </div>
    </div>
  );
}
