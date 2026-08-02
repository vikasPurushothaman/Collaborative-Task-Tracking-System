import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '../ui/Modal';
import { mockUsers } from '../../mock/users';
import { mockProjects } from '../../mock/projects';
import { TASK_STATUSES, TASK_PRIORITIES, CATEGORY_OPTIONS, LABEL_OPTIONS } from '../../constants';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  status: z.enum(['open', 'in_progress', 'completed', 'blocked', 'cancelled']),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  dueDate: z.date().optional().nullable(),
  startDate: z.date().optional().nullable(),
  estimatedHours: z.coerce.number().min(0).optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
});

export default function CreateTaskModal({ isOpen, onClose, onSuccess, defaultValues = {} }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: 'medium',
      status: 'open',
      ...defaultValues,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : null,
        startDate: data.startDate ? format(data.startDate, 'yyyy-MM-dd') : null,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        subtasks: [],
        checklist: [],
        attachments: [],
        comments: [],
        isFavorite: false,
        isPinned: false,
        isArchived: false,
        progress: 0,
        actualHours: 0,
        version: 1,
        history: [],
      };
      await taskService.create(payload);
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="lg" id="create-task-modal">
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        {/* Title */}
        <div>
          <label className="label">Title <span className="text-danger-500">*</span></label>
          <input {...register('title')} id="task-title" placeholder="Enter task title..." className={`input ${errors.title ? 'input-error' : ''}`} />
          {errors.title && <p className="text-xs text-danger-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea {...register('description')} id="task-description" rows={3} placeholder="Add a description..." className="input resize-none" />
        </div>

        {/* Row: Priority + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Priority</label>
            <select {...register('priority')} className="input" id="task-priority">
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select {...register('status')} className="input" id="task-status">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Row: Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Start Date</label>
            <Controller control={control} name="startDate" render={({ field }) => (
              <DatePicker selected={field.value} onChange={field.onChange} placeholderText="Pick start date" className="input w-full" dateFormat="MMM dd, yyyy" id="task-start-date" />
            )} />
          </div>
          <div>
            <label className="label">Due Date</label>
            <Controller control={control} name="dueDate" render={({ field }) => (
              <DatePicker selected={field.value} onChange={field.onChange} placeholderText="Pick due date" className="input w-full" dateFormat="MMM dd, yyyy" id="task-due-date" />
            )} />
          </div>
        </div>

        {/* Assignee + Project */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Assignee</label>
            <select {...register('assigneeId')} className="input" id="task-assignee">
              <option value="">Unassigned</option>
              {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Project</label>
            <select {...register('projectId')} className="input" id="task-project">
              <option value="">No Project</option>
              {mockProjects.filter(p => !p.isArchived).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        {/* Category + Hours */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Category</label>
            <select {...register('category')} className="input" id="task-category">
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Estimated Hours</label>
            <input {...register('estimatedHours')} type="number" min="0" step="0.5" className="input" id="task-hours" placeholder="e.g. 8" />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="label">Tags <span className="text-xs text-surface-400">(comma separated)</span></label>
          <input {...register('tags')} className="input" id="task-tags" placeholder="e.g. frontend, urgent, api" />
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end pt-2 border-t border-surface-100 dark:border-surface-700">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary" id="create-task-submit">
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
