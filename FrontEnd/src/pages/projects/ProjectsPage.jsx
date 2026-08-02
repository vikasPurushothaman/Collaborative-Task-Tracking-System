import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Search, Archive, FolderOpen, MoreHorizontal, Edit2, Trash2, Users, CheckSquare, Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '../../services/projectService';
import { Badge, ProgressBar, Avatar, EmptyState, SkeletonCard } from '../../components/ui/index';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mockUsers } from '../../mock/users';
import { formatDate } from '../../utils';
import { Link } from 'react-router-dom';

const projectSchema = z.object({
  name: z.string().min(2, 'Name required'),
  description: z.string().optional(),
  color: z.string().default('#6172f3'),
  icon: z.string().default('🚀'),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).default('medium'),
  ownerId: z.string().optional(),
  dueDate: z.string().optional(),
  category: z.string().optional(),
  budget: z.coerce.number().min(0).optional(),
});

export default function ProjectsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', showArchived],
    queryFn: () => projectService.getAll({ archived: showArchived }),
    select: d => d.data,
  });

  const deleteMutation = useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => { toast.success('Project deleted'); qc.invalidateQueries(['projects']); setDeleteId(null); },
  });

  const archiveMutation = useMutation({
    mutationFn: projectService.archive,
    onSuccess: () => { toast.success('Project archived'); qc.invalidateQueries(['projects']); },
  });

  const projects = (data?.projects || []).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Projects</h1>
          <p className="text-sm text-surface-500">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowArchived(a => !a)} className={`btn-secondary text-xs ${showArchived ? 'border-brand-400 text-brand-600' : ''}`}>
            <Archive size={13} /> {showArchived ? 'Active' : 'Archived'}
          </button>
          <button onClick={() => setCreateOpen(true)} className="btn-primary gap-2" id="create-project-btn">
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="input pl-8 text-sm" id="project-search" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}</div>
      ) : projects.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No projects found" description={search ? 'Try different search terms' : 'Create your first project to get started'} action={<button onClick={() => setCreateOpen(true)} className="btn-primary">Create Project</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: p.color + '20' }}>
                    {p.icon}
                  </div>
                  <div>
                    <Link to={`/projects/${p.id}`} className="font-semibold text-surface-900 dark:text-surface-100 hover:text-brand-600 transition-colors text-sm">{p.name}</Link>
                    <p className="text-xs text-surface-400 capitalize">{p.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={p.status === 'active' ? 'success' : p.status === 'completed' ? 'brand' : 'surface'} className="text-[10px]">{p.status}</Badge>
                </div>
              </div>

              <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mb-4">{p.description}</p>

              <ProgressBar value={p.progress} showLabel size="sm" className="mb-4" />

              <div className="flex items-center justify-between mb-4 text-xs text-surface-500">
                <span className="flex items-center gap-1"><CheckSquare size={11} /> {p.completedTasks}/{p.totalTasks} tasks</span>
                <span>{formatDate(p.dueDate, 'MMM dd, yyyy')}</span>
              </div>

              {/* Members */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {p.memberIds.slice(0, 4).map(uid => {
                    const u = mockUsers.find(u => u.id === uid);
                    return u ? <Avatar key={uid} src={u.avatar} name={u.name} size="xs" className="-ml-1 first:ml-0 ring-2 ring-white dark:ring-surface-800" /> : null;
                  })}
                  {p.memberIds.length > 4 && <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center text-[10px] font-medium text-surface-500 -ml-1 ring-2 ring-white dark:ring-surface-800">+{p.memberIds.length - 4}</div>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditProject(p)} className="btn-icon p-1"><Edit2 size={12} /></button>
                  <button onClick={() => archiveMutation.mutate(p.id)} className="btn-icon p-1"><Archive size={12} /></button>
                  <button onClick={() => setDeleteId(p.id)} className="btn-icon p-1 text-danger-400"><Trash2 size={12} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Project Modal */}
      <ProjectFormModal
        isOpen={createOpen || !!editProject}
        onClose={() => { setCreateOpen(false); setEditProject(null); }}
        onSuccess={() => { setCreateOpen(false); setEditProject(null); qc.invalidateQueries(['projects']); toast.success(editProject ? 'Project updated!' : 'Project created!'); }}
        defaultValues={editProject}
        isEdit={!!editProject}
      />

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Project" size="sm">
        <div className="p-5">
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-5">This will permanently delete the project and all associated data.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => deleteMutation.mutate(deleteId)} className="btn-danger">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ProjectFormModal({ isOpen, onClose, onSuccess, defaultValues, isEdit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues || { icon: '🚀', color: '#6172f3', priority: 'medium' },
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) await projectService.update(defaultValues.id, data);
      else await projectService.create(data);
      reset();
      onSuccess();
    } catch { toast.error('Failed'); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Project' : 'Create Project'} size="md" id="project-form-modal">
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="label">Icon</label>
            <input {...register('icon')} className="input text-xl text-center" maxLength={2} />
          </div>
          <div className="col-span-3">
            <label className="label">Project Name <span className="text-danger-500">*</span></label>
            <input {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`} placeholder="e.g. TaskFlow Platform" id="project-name" />
            {errors.name && <p className="text-xs text-danger-500 mt-1">{errors.name.message}</p>}
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea {...register('description')} rows={2} className="input resize-none" placeholder="Brief project description..." id="project-description" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Priority</label>
            <select {...register('priority')} className="input" id="project-priority">
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="label">Owner</label>
            <select {...register('ownerId')} className="input" id="project-owner">
              {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Color</label>
            <input {...register('color')} type="color" className="input h-9 p-1 cursor-pointer" id="project-color" />
          </div>
          <div>
            <label className="label">Budget ($)</label>
            <input {...register('budget')} type="number" className="input" placeholder="0" id="project-budget" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Due Date</label>
            <input {...register('dueDate')} type="date" className="input" id="project-due-date" />
          </div>
          <div>
            <label className="label">Category</label>
            <input {...register('category')} className="input" placeholder="e.g. Development" id="project-category" />
          </div>
        </div>
        <div className="flex gap-3 justify-end border-t border-surface-100 dark:border-surface-700 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary" id="project-submit">{isEdit ? 'Save Changes' : 'Create Project'}</button>
        </div>
      </form>
    </Modal>
  );
}
