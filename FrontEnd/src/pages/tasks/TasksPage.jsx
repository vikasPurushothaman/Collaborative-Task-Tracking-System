import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, List, Grid, Columns, Calendar, Clock, Search, Filter, SlidersHorizontal, Trash2, UserPlus, CheckSquare, MoreHorizontal, Star, Archive, Copy, ArrowUpDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskService } from '../../services/taskService';
import { setViewMode, setFilters, resetFilters, toggleSelect, selectAll, clearSelection } from '../../store/slices/taskSlice';
import { openModal } from '../../store/slices/uiSlice';
import { Badge, EmptyState, Loader, SkeletonCard, ProgressBar } from '../../components/ui/index';
import { Avatar } from '../../components/ui/index';
import Modal from '../../components/ui/Modal';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';
import { mockUsers } from '../../mock/users';
import { mockProjects } from '../../mock/projects';
import { STATUS_LABELS, PRIORITY_LABELS, TASK_STATUSES, TASK_PRIORITIES } from '../../constants';
import { formatDate, isOverdue } from '../../utils';
import { Link } from 'react-router-dom';
import KanbanBoard from '../../components/tasks/KanbanBoard';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const VIEW_MODES = [
  { id: 'list', icon: List, label: 'List' },
  { id: 'grid', icon: Grid, label: 'Grid' },
  { id: 'kanban', icon: Columns, label: 'Kanban' },
];

export default function TasksPage() {
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const { viewMode, selectedIds, filters } = useSelector(s => s.tasks);
  const { user } = useSelector(s => s.auth);

  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tasks', filters, page],
    queryFn: () => taskService.getAll({ ...filters, search: searchVal, page, limit: 10 }),
    select: d => d.data,
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => { toast.success('Task deleted'); qc.invalidateQueries(['tasks']); setDeleteConfirmId(null); },
    onError: () => toast.error('Delete failed'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: taskService.bulkDelete,
    onSuccess: () => { toast.success(`${selectedIds.length} tasks deleted`); qc.invalidateQueries(['tasks']); dispatch(clearSelection()); },
  });

  const favMutation = useMutation({
    mutationFn: taskService.toggleFavorite,
    onSuccess: () => qc.invalidateQueries(['tasks']),
  });

  const archiveMutation = useMutation({
    mutationFn: taskService.archive,
    onSuccess: () => { toast.success('Task archived'); qc.invalidateQueries(['tasks']); },
  });

  const tasks = data?.tasks || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleSearch = (val) => {
    setSearchVal(val);
    dispatch(setFilters({ search: val }));
    setPage(1);
  };

  const allIds = tasks.map(t => t.id);
  const allSelected = allIds.length > 0 && allIds.every(id => selectedIds.includes(id));

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Tasks</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">{total} task{total !== 1 ? 's' : ''} total</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilterOpen(true)} className={`btn-secondary gap-2 ${Object.values(filters).some(v => v !== 'all' && v !== '') ? 'border-brand-400 text-brand-600' : ''}`}>
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
          </button>
          <button onClick={() => setCreateOpen(true)} className="btn-primary gap-2" id="create-task-btn">
            <Plus size={14} />
            New Task
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card p-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            value={searchVal}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search tasks..."
            className="input pl-8 py-1.5 text-xs"
            id="task-search"
          />
          {searchVal && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={filters.status}
          onChange={e => { dispatch(setFilters({ status: e.target.value })); setPage(1); }}
          className="input py-1.5 text-xs w-auto"
          id="task-status-filter"
        >
          <option value="all">All Status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={e => { dispatch(setFilters({ priority: e.target.value })); setPage(1); }}
          className="input py-1.5 text-xs w-auto"
          id="task-priority-filter"
        >
          <option value="all">All Priority</option>
          {Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
          {VIEW_MODES.map(m => (
            <button
              key={m.id}
              onClick={() => dispatch(setViewMode(m.id))}
              className={`px-2.5 py-1.5 text-xs transition-colors flex items-center gap-1 ${viewMode === m.id ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}
              title={m.label}
            >
              <m.icon size={14} />
              <span className="hidden md:inline">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Reset Filters */}
        {(filters.status !== 'all' || filters.priority !== 'all' || searchVal) && (
          <button onClick={() => { dispatch(resetFilters()); setSearchVal(''); setPage(1); }} className="text-xs text-danger-500 hover:underline flex items-center gap-1">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="card p-3 border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/20">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">{selectedIds.length} selected</span>
              <div className="flex items-center gap-2 ml-auto">
                <button onClick={() => bulkDeleteMutation.mutate(selectedIds)} className="btn-secondary text-xs gap-1 border-danger-300 text-danger-600 hover:bg-danger-50">
                  <Trash2 size={12} /> Delete
                </button>
                <button onClick={() => dispatch(clearSelection())} className="btn-ghost text-xs"><X size={12} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3">
          {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          description="Create your first task or adjust your filters."
          action={<button onClick={() => setCreateOpen(true)} className="btn-primary">Create Task</button>}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard tasks={tasks} onRefetch={refetch} />
      ) : viewMode === 'grid' ? (
        <TaskGridView tasks={tasks} selectedIds={selectedIds} onToggleSelect={id => dispatch(toggleSelect(id))} onDelete={setDeleteConfirmId} onFav={id => favMutation.mutate(id)} onArchive={id => archiveMutation.mutate(id)} />
      ) : (
        <TaskListView tasks={tasks} selectedIds={selectedIds} allSelected={allSelected} onSelectAll={() => allSelected ? dispatch(clearSelection()) : dispatch(selectAll(allIds))} onToggleSelect={id => dispatch(toggleSelect(id))} onDelete={setDeleteConfirmId} onFav={id => favMutation.mutate(id)} onArchive={id => archiveMutation.mutate(id)} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1 px-3 text-xs disabled:opacity-40">Prev</button>
          <span className="text-sm text-surface-500">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary py-1 px-3 text-xs disabled:opacity-40">Next</button>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSuccess={() => { setCreateOpen(false); qc.invalidateQueries(['tasks']); toast.success('Task created!'); }} />

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Task" size="sm">
        <div className="p-5">
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-5">Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => deleteMutation.mutate(deleteConfirmId)} className="btn-danger" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function TaskListView({ tasks, selectedIds, allSelected, onSelectAll, onToggleSelect, onDelete, onFav, onArchive }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
              <th className="px-4 py-2.5 text-left">
                <input type="checkbox" checked={allSelected} onChange={onSelectAll} className="rounded border-surface-300" />
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">Priority</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Status</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">Due Date</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider hidden xl:table-cell">Assignee</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
            {tasks.map(task => {
              const assignee = mockUsers.find(u => u.id === task.assigneeId);
              const overdue = isOverdue(task.dueDate, task.status);
              return (
                <tr key={task.id} className={`hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors ${selectedIds.includes(task.id) ? 'bg-brand-50 dark:bg-brand-900/10' : ''}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => onToggleSelect(task.id)} className="rounded border-surface-300" />
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/tasks/${task.id}`} className="flex items-center gap-2 group">
                      {task.isPinned && <span className="text-brand-400 text-xs">📌</span>}
                      {task.isFavorite && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                      <span className={`text-sm font-medium group-hover:text-brand-600 transition-colors ${task.status === 'completed' ? 'line-through text-surface-400' : 'text-surface-900 dark:text-surface-100'}`}>{task.title}</span>
                    </Link>
                    {task.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {task.tags.slice(0, 2).map(t => <span key={t} className="badge-surface text-[10px] px-1.5 py-0.5 rounded-full">{t}</span>)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant={task.priority}>{PRIORITY_LABELS[task.priority]}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge variant={task.status}>{STATUS_LABELS[task.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs ${overdue ? 'text-danger-500 font-medium' : 'text-surface-500 dark:text-surface-400'}`}>
                      {overdue && '⚠ '}{formatDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell">
                    {assignee && <Avatar src={assignee.avatar} name={assignee.name} size="xs" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onFav(task.id)} className="btn-icon p-1" title="Favorite">
                        <Star size={13} className={task.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
                      </button>
                      <button onClick={() => onArchive(task.id)} className="btn-icon p-1" title="Archive">
                        <Archive size={13} />
                      </button>
                      <button onClick={() => onDelete(task.id)} className="btn-icon p-1 text-danger-400 hover:text-danger-600" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TaskGridView({ tasks, selectedIds, onToggleSelect, onDelete, onFav, onArchive }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map(task => {
        const assignee = mockUsers.find(u => u.id === task.assigneeId);
        const overdue = isOverdue(task.dueDate, task.status);
        return (
          <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className={`card p-4 cursor-pointer hover:shadow-card-hover transition-all ${selectedIds.includes(task.id) ? 'ring-2 ring-brand-400' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant={task.priority}>{PRIORITY_LABELS[task.priority]}</Badge>
                {task.isFavorite && <Star size={12} className="fill-yellow-400 text-yellow-400" />}
              </div>
              <input type="checkbox" checked={selectedIds.includes(task.id)} onChange={() => onToggleSelect(task.id)} className="rounded border-surface-300" />
            </div>
            <Link to={`/tasks/${task.id}`}>
              <h3 className={`font-medium text-sm mb-1 hover:text-brand-600 transition-colors line-clamp-2 ${task.status === 'completed' ? 'line-through text-surface-400' : 'text-surface-900 dark:text-surface-100'}`}>{task.title}</h3>
              {task.description && <p className="text-xs text-surface-500 line-clamp-2 mb-3">{task.description}</p>}
            </Link>
            {task.progress > 0 && <ProgressBar value={task.progress} size="sm" className="mb-3" />}
            <div className="flex items-center justify-between">
              <Badge variant={task.status}>{STATUS_LABELS[task.status]}</Badge>
              <div className="flex items-center gap-2">
                {assignee && <Avatar src={assignee.avatar} name={assignee.name} size="xs" />}
                <span className={`text-[11px] ${overdue ? 'text-danger-500 font-medium' : 'text-surface-400'}`}>{formatDate(task.dueDate, 'MMM dd')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-surface-100 dark:border-surface-700">
              <button onClick={() => onFav(task.id)} className="btn-icon p-1 text-xs"><Star size={12} className={task.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} /></button>
              <button onClick={() => onArchive(task.id)} className="btn-icon p-1"><Archive size={12} /></button>
              <button onClick={() => onDelete(task.id)} className="btn-icon p-1 text-danger-400"><Trash2 size={12} /></button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
