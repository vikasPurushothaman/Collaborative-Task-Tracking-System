import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, CheckCheck, AlertCircle, CheckCircle, MessageSquare, AtSign, Users, FolderOpen, Settings } from 'lucide-react';
import { markRead, markAllRead, deleteNotification } from '../../store/slices/notificationSlice';
import { formatRelativeTime } from '../../utils';

const iconMap = {
  task: CheckCircle, comment: MessageSquare, warning: AlertCircle, alert: AlertCircle,
  project: FolderOpen, team: Users, mention: AtSign, success: CheckCircle,
  reaction: Bell, system: Settings,
};

const colorMap = {
  urgent: 'text-danger-500', high: 'text-warning-500', normal: 'text-brand-500', low: 'text-surface-400',
};

export default function NotificationDropdown({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, unreadCount } = useSelector(s => s.notifications);
  const recent = items.slice(0, 8);

  const handleClick = (n) => {
    dispatch(markRead(n.id));
    navigate(n.link);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-80 card shadow-modal z-50 overflow-hidden"
      id="notification-dropdown"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-surface-900 dark:text-surface-100">Notifications</h3>
          {unreadCount > 0 && <span className="badge bg-accent-500 text-white">{unreadCount}</span>}
        </div>
        <button onClick={() => dispatch(markAllRead())} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
          <CheckCheck size={12} /> All read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {recent.length === 0 ? (
          <div className="py-8 text-center text-surface-400">
            <Bell size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          recent.map(n => {
            const Icon = iconMap[n.icon] || Bell;
            return (
              <div
                key={n.id}
                className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors border-b border-surface-100 dark:border-surface-700/50 ${!n.isRead ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
                onClick={() => handleClick(n)}
              >
                <div className={`flex-shrink-0 mt-0.5 ${colorMap[n.priority] || 'text-brand-500'}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-surface-900 dark:text-surface-100">{n.title}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-[11px] text-surface-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {!n.isRead && <span className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0 mt-1" />}
                  <button
                    onClick={e => { e.stopPropagation(); dispatch(deleteNotification(n.id)); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-200 dark:hover:bg-surface-600 rounded"
                  >
                    <Trash2 size={11} className="text-surface-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-2.5 border-t border-surface-200 dark:border-surface-700">
        <button
          onClick={() => { navigate('/notifications'); onClose(); }}
          className="text-xs text-brand-600 dark:text-brand-400 hover:underline w-full text-center"
        >
          View all notifications
        </button>
      </div>
    </motion.div>
  );
}
