import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FloatingActionButton from '../components/layout/FloatingActionButton';
import FloatingChatButton from '../components/layout/FloatingChatButton';
import { setSidebarOpen } from '../store/slices/uiSlice';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function AppLayout() {
  const dispatch = useDispatch();
  const { sidebarOpen, sidebarCollapsed, theme } = useSelector(s => s.ui);

  // Apply theme class on mount and change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Register global keyboard shortcuts
  useKeyboardShortcuts();

  // Close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) dispatch(setSidebarOpen(false));
      else dispatch(setSidebarOpen(true));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-950">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300`}>
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* FABs */}
      <FloatingActionButton />
      <FloatingChatButton />
    </div>
  );
}
