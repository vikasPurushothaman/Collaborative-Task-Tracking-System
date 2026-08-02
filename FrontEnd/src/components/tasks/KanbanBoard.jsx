import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { taskService } from '../../services/taskService';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../constants';
import { Badge, Avatar } from '../ui/index';
import { mockUsers } from '../../mock/users';
import { isOverdue, formatDate } from '../../utils';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const COLUMNS = [
  { key: 'open', label: 'Open', color: 'blue' },
  { key: 'in_progress', label: 'In Progress', color: 'purple' },
  { key: 'blocked', label: 'Blocked', color: 'red' },
  { key: 'completed', label: 'Completed', color: 'green' },
];

export default function KanbanBoard({ tasks, onRefetch }) {
  const qc = useQueryClient();
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.update(id, { status }),
    onSuccess: () => { qc.invalidateQueries(['tasks']); onRefetch?.(); },
    onError: () => toast.error('Failed to update task'),
  });

  const handleDragStart = (e, task) => {
    setDragging(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, colKey) => {
    e.preventDefault();
    if (dragging && dragging.status !== colKey) {
      updateMutation.mutate({ id: dragging.id, status: colKey });
      toast.success(`Moved to ${STATUS_LABELS[colKey]}`);
    }
    setDragging(null);
    setDragOver(null);
  };

  const getColumnTasks = (status) => tasks.filter(t => t.status === status);

  const colColors = { blue: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800', purple: 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800', red: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800', green: 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' };
  const headerColors = { blue: 'text-blue-700 dark:text-blue-400', purple: 'text-purple-700 dark:text-purple-400', red: 'text-red-700 dark:text-red-400', green: 'text-green-700 dark:text-green-400' };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto pb-2">
      {COLUMNS.map(col => {
        const colTasks = getColumnTasks(col.key);
        const isOver = dragOver === col.key;
        return (
          <div
            key={col.key}
            className={`flex flex-col min-w-64 rounded-xl border-2 transition-all ${isOver ? 'kanban-column-drag-over' : colColors[col.color] || colColors.blue}`}
            onDragOver={e => { e.preventDefault(); setDragOver(col.key); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, col.key)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-current/10">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-semibold ${headerColors[col.color]}`}>{col.label}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-current/10 ${headerColors[col.color]}`}>{colTasks.length}</span>
              </div>
              <button className="btn-icon p-1" title={`Add task in ${col.label}`}>
                <Plus size={14} className={headerColors[col.color]} />
              </button>
            </div>

            {/* Tasks */}
            <div className="flex-1 p-3 space-y-2.5 min-h-32">
              {colTasks.map(task => {
                const assignee = mockUsers.find(u => u.id === task.assigneeId);
                const overdue = isOverdue(task.dueDate, task.status);
                return (
                  <motion.div
                    key={task.id}
                    layout
                    draggable
                    onDragStart={e => handleDragStart(e, task)}
                    onDragEnd={() => setDragging(null)}
                    className={`card p-3 cursor-grab active:cursor-grabbing hover:shadow-card-hover transition-all ${dragging?.id === task.id ? 'opacity-50 rotate-2 scale-105' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <Badge variant={task.priority} className="text-[10px]">{PRIORITY_LABELS[task.priority]}</Badge>
                      {assignee && <Avatar src={assignee.avatar} name={assignee.name} size="xs" />}
                    </div>
                    <Link to={`/tasks/${task.id}`} className="block">
                      <p className="text-xs font-medium text-surface-900 dark:text-surface-100 hover:text-brand-600 transition-colors line-clamp-2">{task.title}</p>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-[11px] ${overdue ? 'text-danger-500 font-medium' : 'text-surface-400'}`}>{formatDate(task.dueDate, 'MMM dd')}</span>
                      {task.subtasks?.length > 0 && (
                        <span className="text-[11px] text-surface-400">{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="flex items-center justify-center h-20 text-xs text-surface-400 border-2 border-dashed border-current/20 rounded-xl">
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
