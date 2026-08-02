import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, Sun, Moon, ChevronDown, LogOut, User, Settings, Shield, Plus } from 'lucide-react';
import { toggleTheme, toggleSidebar, openCommandPalette, openModal } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { markAllRead } from '../../store/slices/notificationSlice';
import { useClickOutside } from '../../hooks/useUtils';
import { getInitials, formatRelativeTime } from '../../utils';
import NotificationDropdown from '../common/NotificationDropdown';
import Breadcrumb from './Breadcrumb';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector(s => s.ui);
  const { user } = useSelector(s => s.auth);
  const { unreadCount } = useSelector(s => s.notifications);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useClickOutside(() => setProfileOpen(false));
  const notifRef = useClickOutside(() => setNotifOpen(false));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700/50 flex items-center px-4 gap-3 sticky top-0 z-20 flex-shrink-0">
      {/* Menu Toggle */}
      <button onClick={() => dispatch(toggleSidebar())} className="btn-icon flex-shrink-0">
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <Breadcrumb />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Search */}
        <button
          onClick={() => dispatch(openCommandPalette())}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-surface-400 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors border border-surface-200 dark:border-surface-700 mr-1"
          id="global-search-btn"
        >
          <Search size={14} />
          <span>Search...</span>
          <kbd className="hidden lg:inline-block px-1 py-0.5 text-xs bg-white dark:bg-surface-700 rounded border border-surface-200 dark:border-surface-600 text-surface-400">⌘K</kbd>
        </button>

        {/* Quick Create */}
        <button
          onClick={() => dispatch(openModal('createTask'))}
          className="btn-primary gap-1 py-1.5 px-3 text-xs hidden sm:flex"
          id="quick-create-btn"
        >
          <Plus size={14} />
          New Task
        </button>

        {/* Theme Toggle */}
        <button onClick={() => dispatch(toggleTheme())} className="btn-icon" id="theme-toggle-btn" title="Toggle dark mode">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="btn-icon relative"
            id="notification-bell-btn"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-accent-500 text-white text-[10px] rounded-full flex items-center justify-center px-0.5 font-semibold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700/60 transition-colors"
            id="profile-dropdown-btn"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-brand-700 dark:text-brand-300 text-xs font-semibold">
                {getInitials(user?.name)}
              </div>
            )}
            <span className="hidden lg:block text-sm font-medium text-surface-700 dark:text-surface-300 max-w-[100px] truncate">{user?.name}</span>
            <ChevronDown size={14} className="text-surface-400 hidden lg:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 card shadow-modal py-1 z-50"
              >
                <div className="px-3 py-2 border-b border-surface-100 dark:border-surface-700">
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{user?.name}</p>
                  <p className="text-xs text-surface-400 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <MenuItem icon={User} label="View Profile" onClick={() => { navigate('/profile'); setProfileOpen(false); }} />
                  <MenuItem icon={Settings} label="Settings" onClick={() => { navigate('/settings'); setProfileOpen(false); }} />
                  {(user?.role === 'owner' || user?.role === 'admin') && (
                    <MenuItem icon={Shield} label="Admin Panel" onClick={() => { navigate('/admin'); setProfileOpen(false); }} />
                  )}
                </div>
                <div className="border-t border-surface-100 dark:border-surface-700 py-1">
                  <MenuItem icon={LogOut} label="Sign Out" onClick={handleLogout} danger />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${danger ? 'text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}
