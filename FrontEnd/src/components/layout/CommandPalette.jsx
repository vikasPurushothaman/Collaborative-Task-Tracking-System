import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, CheckSquare, FolderOpen, Users, LayoutDashboard, BarChart3, Calendar, Settings, Plus, Hash } from 'lucide-react';
import { closeCommandPalette, openModal } from '../../store/slices/uiSlice';
import { mockTasks } from '../../mock/tasks';
import { mockProjects } from '../../mock/projects';
import { useDebounce } from '../../hooks/useUtils';

const staticCommands = [
  { type: 'nav', label: 'Go to Dashboard', icon: LayoutDashboard, shortcut: 'G D', to: '/dashboard' },
  { type: 'nav', label: 'Go to Tasks', icon: CheckSquare, shortcut: 'G T', to: '/tasks' },
  { type: 'nav', label: 'Go to Projects', icon: FolderOpen, shortcut: 'G P', to: '/projects' },
  { type: 'nav', label: 'Go to Analytics', icon: BarChart3, to: '/analytics' },
  { type: 'nav', label: 'Go to Calendar', icon: Calendar, to: '/calendar' },
  { type: 'nav', label: 'Go to Settings', icon: Settings, to: '/settings' },
  { type: 'action', label: 'Create New Task', icon: Plus, action: 'createTask' },
  { type: 'action', label: 'Create New Project', icon: FolderOpen, action: 'createProject' },
];

export default function CommandPalette() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const debouncedQuery = useDebounce(query, 150);

  const results = debouncedQuery
    ? [
        ...mockTasks.filter(t => t.title.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0, 3).map(t => ({ type: 'task', label: t.title, icon: CheckSquare, to: `/tasks/${t.id}`, sub: t.status })),
        ...mockProjects.filter(p => p.name.toLowerCase().includes(debouncedQuery.toLowerCase())).slice(0, 2).map(p => ({ type: 'project', label: p.name, icon: FolderOpen, to: `/projects/${p.id}`, sub: p.status })),
        ...staticCommands.filter(c => c.label.toLowerCase().includes(debouncedQuery.toLowerCase())),
      ]
    : staticCommands;

  useEffect(() => { setActiveIndex(0); }, [debouncedQuery]);

  const handleSelect = (item) => {
    if (item.to) { navigate(item.to); dispatch(closeCommandPalette()); }
    else if (item.action) { dispatch(openModal(item.action)); dispatch(closeCommandPalette()); }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') dispatch(closeCommandPalette());
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && results[activeIndex]) handleSelect(results[activeIndex]);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [results, activeIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      onClick={() => dispatch(closeCommandPalette())}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-xl card shadow-modal overflow-hidden"
        id="command-palette"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700">
          <Search size={16} className="text-surface-400 flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks, projects, commands..."
            className="flex-1 bg-transparent text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none text-sm"
          />
          {query && <button onClick={() => setQuery('')} className="text-surface-400 hover:text-surface-600"><X size={14} /></button>}
          <kbd className="text-xs bg-surface-100 dark:bg-surface-700 px-1.5 py-0.5 rounded border border-surface-200 dark:border-surface-600 text-surface-400">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="text-center py-8 text-surface-400 text-sm">No results found</div>
          ) : (
            results.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${activeIndex === i ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
              >
                <item.icon size={15} className="flex-shrink-0 text-surface-400" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.sub && <span className="text-xs text-surface-400 capitalize">{item.sub}</span>}
                {item.shortcut && <kbd className="text-xs bg-surface-100 dark:bg-surface-700 px-1.5 py-0.5 rounded text-surface-400">{item.shortcut}</kbd>}
                <ArrowRight size={12} className="text-surface-300 flex-shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="border-t border-surface-200 dark:border-surface-700 px-4 py-2 flex items-center gap-4 text-xs text-surface-400">
          <span className="flex items-center gap-1"><kbd className="bg-surface-100 dark:bg-surface-700 px-1 rounded">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-surface-100 dark:bg-surface-700 px-1 rounded">↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="bg-surface-100 dark:bg-surface-700 px-1 rounded">ESC</kbd> Close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
