import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, FolderOpen, Users, BarChart3,
  Calendar, Bell, Settings, HelpCircle, Zap, Shield, ChevronLeft,
  ChevronRight, Hash, Star, Clock
} from 'lucide-react';
import { toggleSidebarCollapse, setSidebarOpen } from '../../store/slices/uiSlice';
import { getInitials } from '../../utils';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Tasks', icon: CheckSquare, to: '/tasks' },
  { label: 'Projects', icon: FolderOpen, to: '/projects' },
  { label: 'Teams', icon: Users, to: '/teams' },
  { label: 'Analytics', icon: BarChart3, to: '/analytics' },
  { label: 'Calendar', icon: Calendar, to: '/calendar' },
  { label: 'Notifications', icon: Bell, to: '/notifications' },
];

const bottomItems = [
  { label: 'AI Assistant', icon: Zap, to: '/ai' },
  { label: 'Help Center', icon: HelpCircle, to: '/help' },
  { label: 'Admin Panel', icon: Shield, to: '/admin' },
  { label: 'Settings', icon: Settings, to: '/settings' },
];

const quickLinks = [
  { label: 'Favorites', icon: Star, to: '/tasks?filter=favorite' },
  { label: 'Recent', icon: Clock, to: '/tasks?filter=recent' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarOpen, sidebarCollapsed } = useSelector(s => s.ui);
  const { user } = useSelector(s => s.auth);
  const { unreadCount } = useSelector(s => s.notifications);
  const location = useLocation();

  const collapsed = sidebarCollapsed;

  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed md:relative z-30 h-full flex-shrink-0 flex flex-col bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700/50 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
        >
          {/* Logo */}
          <div className={`flex items-center gap-3 px-4 py-4 border-b border-surface-200 dark:border-surface-700/50 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-glow">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent"
              >
                TaskFlow
              </motion.span>
            )}
          </div>

          {/* Scrollable nav area */}
          <div className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
            {/* Main Navigation */}
            {navItems.map(item => (
              <SidebarLink key={item.to} item={item} collapsed={collapsed} badge={item.to === '/notifications' ? unreadCount : null} />
            ))}

            {/* Divider */}
            {!collapsed && (
              <div className="px-2 pt-4 pb-1">
                <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Quick Access</span>
              </div>
            )}
            {collapsed && <div className="my-2 border-t border-surface-200 dark:border-surface-700" />}
            {quickLinks.map(item => (
              <SidebarLink key={item.to} item={item} collapsed={collapsed} />
            ))}
          </div>

          {/* Bottom Links */}
          <div className="border-t border-surface-200 dark:border-surface-700/50 px-2 py-2 space-y-0.5">
            {bottomItems.map(item => (
              <SidebarLink key={item.to} item={item} collapsed={collapsed} />
            ))}
          </div>

          {/* User Profile */}
          {!collapsed && user && (
            <div className="border-t border-surface-200 dark:border-surface-700/50 p-3">
              <NavLink to="/profile" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-colors group">
                <div className="relative flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 font-semibold text-sm">
                      {getInitials(user.name)}
                    </div>
                  )}
                  {user.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success-500 rounded-full border-2 border-white dark:border-surface-900" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">{user.name}</p>
                  <p className="text-xs text-surface-400 truncate capitalize">{user.role}</p>
                </div>
              </NavLink>
            </div>
          )}

          {/* Collapse Toggle (desktop only) */}
          <button
            onClick={() => dispatch(toggleSidebarCollapse())}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-full shadow-card text-surface-500 hover:text-brand-600 transition-colors z-10"
          >
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function SidebarLink({ item, collapsed, badge }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative group ${collapsed ? 'justify-center' : ''} ${isActive ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700/60 hover:text-surface-900 dark:hover:text-surface-100'}`
      }
    >
      <item.icon size={18} className="flex-shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && badge > 0 && (
        <span className="min-w-[18px] h-[18px] bg-accent-500 text-white text-xs rounded-full flex items-center justify-center px-1 font-semibold">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      {collapsed && badge > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-accent-500 text-white text-[10px] rounded-full flex items-center justify-center px-0.5">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2 py-1 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {item.label}
        </div>
      )}
    </NavLink>
  );
}
