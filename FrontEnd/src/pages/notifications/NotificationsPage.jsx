import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Trash2, AlertCircle, CheckCircle, MessageSquare, AtSign, Users, FolderOpen, Settings, Filter } from 'lucide-react';
import { markRead, markAllRead, deleteNotification, clearAll } from '../../store/slices/notificationSlice';
import { formatRelativeTime } from '../../utils';

const iconMap = { task: CheckCircle, comment: MessageSquare, warning: AlertCircle, alert: AlertCircle, project: FolderOpen, team: Users, mention: AtSign, success: CheckCircle, reaction: Bell, system: Settings };
const colorMap = { urgent: 'text-danger-500', high: 'text-warning-500', normal: 'text-brand-500', low: 'text-surface-400' };

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector(s => s.notifications);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Notifications</h1>
          <p className="text-sm text-surface-500">{unreadCount} unread</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => dispatch(markAllRead())} className="btn-secondary text-xs gap-1.5"><CheckCheck size={13} /> Mark all read</button>
          <button onClick={() => dispatch(clearAll())} className="btn-secondary text-xs gap-1.5 text-danger-500 border-danger-200"><Trash2 size={13} /> Clear all</button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell size={40} className="mx-auto text-surface-300 mb-3" />
          <h3 className="font-semibold text-surface-700 dark:text-surface-300">All caught up!</h3>
          <p className="text-sm text-surface-400 mt-1">No notifications</p>
        </div>
      ) : (
        <div className="card overflow-hidden divide-y divide-surface-100 dark:divide-surface-700/50">
          {items.map((n, i) => {
            const Icon = iconMap[n.icon] || Bell;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex gap-4 p-4 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors ${!n.isRead ? 'bg-brand-50/30 dark:bg-brand-900/10' : ''}`}
                onClick={() => dispatch(markRead(n.id))}
              >
                <div className={`flex-shrink-0 mt-0.5 ${colorMap[n.priority] || 'text-brand-500'}`}><Icon size={18} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{n.title}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{n.message}</p>
                  <p className="text-xs text-surface-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {!n.isRead && <span className="w-2.5 h-2.5 bg-brand-500 rounded-full" />}
                  <button onClick={e => { e.stopPropagation(); dispatch(deleteNotification(n.id)); }} className="btn-icon p-1 text-surface-400 hover:text-danger-500"><Trash2 size={13} /></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
