import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNames = {
  dashboard: 'Dashboard', tasks: 'Tasks', projects: 'Projects', teams: 'Teams',
  analytics: 'Analytics', calendar: 'Calendar', notifications: 'Notifications',
  profile: 'Profile', settings: 'Settings', admin: 'Admin', ai: 'AI Assistant',
  help: 'Help Center', edit: 'Edit', 'change-password': 'Change Password', users: 'Users',
};

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link to="/dashboard" className="text-surface-400 hover:text-brand-600 transition-colors">
        <Home size={14} />
      </Link>
      {segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const label = routeNames[seg] || (seg.startsWith('task-') ? 'Task Detail' : seg.startsWith('p') ? 'Project' : seg.startsWith('t') ? 'Team' : seg);
        const isLast = i === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight size={12} className="text-surface-300 dark:text-surface-600" />
            {isLast ? (
              <span className="font-medium text-surface-900 dark:text-surface-100 capitalize">{label}</span>
            ) : (
              <Link to={path} className="text-surface-400 hover:text-brand-600 transition-colors capitalize">{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
