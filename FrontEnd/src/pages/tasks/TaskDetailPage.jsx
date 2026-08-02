import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Trash2, Archive, Copy, Star, Clock, Calendar, User, FolderOpen, Flag, MessageSquare, Paperclip, CheckSquare, History, MoreHorizontal, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskService } from '../../services/taskService';
import { mockUsers } from '../../mock/users';
import { mockProjects } from '../../mock/projects';
import { mockComments } from '../../mock/comments';
import { mockAttachments } from '../../mock/attachments';
import { Badge, Avatar, ProgressBar, Loader } from '../../components/ui/index';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../constants';
import { formatDate, formatRelativeTime, formatFileSize, isOverdue } from '../../utils';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');
  const [editingStatus, setEditingStatus] = useState(false);

  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getById(id),
    select: d => d.data,
  });

  const updateMutation = useMutation({
    mutationFn: (updates) => taskService.update(id, updates),
    onSuccess: () => { qc.invalidateQueries(['task', id]); toast.success('Task updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: () => taskService.delete(id),
    onSuccess: () => { toast.success('Task deleted'); navigate('/tasks'); },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader size="lg" /></div>;
  if (error || !task) return (
    <div className="text-center py-20">
      <p className="text-surface-500">Task not found</p>
      <Link to="/tasks" className="btn-primary mt-4 inline-flex">Back to Tasks</Link>
    </div>
  );

  const assignee = mockUsers.find(u => u.id === task.assigneeId);
  const reporter = mockUsers.find(u => u.id === task.reporterId);
  const project = mockProjects.find(p => p.id === task.projectId);
  const taskComments = mockComments.filter(c => c.taskId === task.id);
  const taskAttachments = mockAttachments.filter(a => a.taskId === task.id);
  const overdue = isOverdue(task.dueDate, task.status);
  const tabs = ['overview', 'comments', 'attachments', 'checklist', 'history'];

  const toggleSubtask = (stId) => {
    const updated = task.subtasks.map(s => s.id === stId ? { ...s, completed: !s.completed } : s);
    updateMutation.mutate({ subtasks: updated, progress: Math.round(updated.filter(s => s.completed).length / updated.length * 100) });
  };

  const toggleChecklist = (clId) => {
    const updated = task.checklist.map(c => c.id === clId ? { ...c, done: !c.done } : c);
    updateMutation.mutate({ checklist: updated });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="btn-ghost gap-1.5 text-sm">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => updateMutation.mutate({ isFavorite: !task.isFavorite })} className="btn-icon">
            <Star size={16} className={task.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} />
          </button>
          <button onClick={() => taskService.duplicate(id).then(() => { toast.success('Task duplicated'); qc.invalidateQueries(['tasks']); })} className="btn-icon"><Copy size={16} /></button>
          <button onClick={() => taskService.archive(id).then(() => { toast.success('Task archived'); navigate('/tasks'); })} className="btn-icon"><Archive size={16} /></button>
          <button onClick={() => { if (confirm('Delete this task?')) deleteMutation.mutate(); }} className="btn-icon text-danger-400 hover:text-danger-600"><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title Card */}
          <div className="card p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={task.priority}>{PRIORITY_LABELS[task.priority]}</Badge>
                <Badge variant={task.status}>{STATUS_LABELS[task.status]}</Badge>
                {overdue && <Badge variant="danger">⚠ Overdue</Badge>}
                {task.isPinned && <span className="text-xs text-brand-500">📌 Pinned</span>}
              </div>
            </div>
            <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">{task.title}</h1>
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{task.description || 'No description provided.'}</p>

            {task.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {task.tags.map(tag => <span key={tag} className="badge-surface text-xs px-2 py-0.5 rounded-full">#{tag}</span>)}
              </div>
            )}

            {task.progress > 0 && <div className="mt-4"><ProgressBar value={task.progress} showLabel color="gradient" /></div>}
          </div>

          {/* Tabs */}
          <div className="card overflow-hidden">
            <div className="flex border-b border-surface-200 dark:border-surface-700 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'text-brand-600 border-b-2 border-brand-600' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}
                >
                  {tab}
                  {tab === 'comments' && taskComments.length > 0 && <span className="ml-1.5 badge-brand text-[10px] px-1.5 py-0.5 rounded-full">{taskComments.length}</span>}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {task.subtasks?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-surface-900 dark:text-surface-100">Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})</h3>
                      <div className="space-y-2">
                        {task.subtasks.map(st => (
                          <label key={st.id} className="flex items-center gap-2.5 cursor-pointer group">
                            <input type="checkbox" checked={st.completed} onChange={() => toggleSubtask(st.id)} className="rounded border-surface-300 text-brand-500" />
                            <span className={`text-sm ${st.completed ? 'line-through text-surface-400' : 'text-surface-700 dark:text-surface-300'}`}>{st.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {task.labels?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-surface-900 dark:text-surface-100">Labels</h3>
                      <div className="flex flex-wrap gap-2">
                        {task.labels.map(l => <Badge key={l} variant="brand">{l}</Badge>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Avatar src={mockUsers[0].avatar} name={mockUsers[0].name} size="sm" />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Write a comment... (@mention teammates)"
                        rows={3}
                        className="input resize-none text-sm"
                      />
                      <div className="flex justify-end mt-2">
                        <button onClick={() => { if (newComment.trim()) { toast.success('Comment added!'); setNewComment(''); } }} className="btn-primary text-xs">Post Comment</button>
                      </div>
                    </div>
                  </div>
                  {taskComments.map(c => {
                    const author = mockUsers.find(u => u.id === c.authorId);
                    return (
                      <div key={c.id} className="flex gap-3">
                        <Avatar src={author?.avatar} name={author?.name} size="sm" />
                        <div className="flex-1 bg-surface-50 dark:bg-surface-700/50 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{author?.name}</span>
                            <span className="text-xs text-surface-400">{formatRelativeTime(c.createdAt)}</span>
                          </div>
                          <p className="text-sm text-surface-700 dark:text-surface-300">{c.content}</p>
                          {c.reactions?.length > 0 && (
                            <div className="flex gap-1.5 mt-2">
                              {c.reactions.map((r, i) => (
                                <button key={i} className="flex items-center gap-1 px-2 py-0.5 bg-surface-100 dark:bg-surface-600 rounded-full text-xs hover:bg-surface-200 transition-colors">
                                  {r.emoji} {r.userIds.length}
                                </button>
                              ))}
                            </div>
                          )}
                          {c.replies?.map(r => {
                            const ra = mockUsers.find(u => u.id === r.authorId);
                            return (
                              <div key={r.id} className="flex gap-2 mt-3 pl-4 border-l-2 border-surface-200 dark:border-surface-600">
                                <Avatar src={ra?.avatar} name={ra?.name} size="xs" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-surface-900 dark:text-surface-100">{ra?.name}</span>
                                    <span className="text-[11px] text-surface-400">{formatRelativeTime(r.createdAt)}</span>
                                  </div>
                                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-0.5">{r.content}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {taskComments.length === 0 && <p className="text-sm text-surface-400 text-center py-4">No comments yet. Be the first!</p>}
                </div>
              )}

              {activeTab === 'attachments' && (
                <div>
                  <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl p-8 text-center mb-4 hover:border-brand-400 transition-colors cursor-pointer">
                    <Paperclip size={24} className="mx-auto text-surface-400 mb-2" />
                    <p className="text-sm text-surface-500">Drag & drop files here or <span className="text-brand-600 hover:underline cursor-pointer">browse</span></p>
                    <p className="text-xs text-surface-400 mt-1">Max file size: 25MB</p>
                  </div>
                  <div className="space-y-2">
                    {taskAttachments.map(att => (
                      <div key={att.id} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                        <div className="w-8 h-8 bg-surface-200 dark:bg-surface-600 rounded-lg flex items-center justify-center text-sm">
                          {att.type === 'image' ? '🖼️' : att.type === 'pdf' ? '📄' : '📁'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">{att.name}</p>
                          <p className="text-xs text-surface-400">{formatFileSize(att.size)} · {formatRelativeTime(att.uploadedAt)}</p>
                        </div>
                        <button className="btn-icon p-1.5"><ArrowLeft size={14} className="rotate-180" /></button>
                      </div>
                    ))}
                    {taskAttachments.length === 0 && <p className="text-sm text-surface-400 text-center py-4">No attachments</p>}
                  </div>
                </div>
              )}

              {activeTab === 'checklist' && (
                <div className="space-y-2">
                  {task.checklist?.map(item => (
                    <label key={item.id} className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer">
                      <input type="checkbox" checked={item.done} onChange={() => toggleChecklist(item.id)} className="rounded border-surface-300 text-brand-500" />
                      <span className={`text-sm ${item.done ? 'line-through text-surface-400' : 'text-surface-700 dark:text-surface-300'}`}>{item.text}</span>
                    </label>
                  ))}
                  {(!task.checklist || task.checklist.length === 0) && <p className="text-sm text-surface-400 text-center py-4">No checklist items</p>}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-3">
                  {task.history?.map(h => (
                    <div key={h.id} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 bg-brand-400 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-surface-700 dark:text-surface-300">{h.details}</p>
                        <p className="text-xs text-surface-400 mt-0.5">{formatDate(h.timestamp)} · v{task.version}</p>
                      </div>
                    </div>
                  ))}
                  {(!task.history || task.history.length === 0) && <p className="text-sm text-surface-400 text-center py-4">No history available</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-4 space-y-4">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Details</h3>

            <DetailRow icon={User} label="Assignee">
              {assignee ? (
                <div className="flex items-center gap-2"><Avatar src={assignee.avatar} name={assignee.name} size="xs" /><span className="text-sm text-surface-700 dark:text-surface-300">{assignee.name}</span></div>
              ) : <span className="text-sm text-surface-400">Unassigned</span>}
            </DetailRow>

            <DetailRow icon={User} label="Reporter">
              {reporter && <div className="flex items-center gap-2"><Avatar src={reporter.avatar} name={reporter.name} size="xs" /><span className="text-sm text-surface-700 dark:text-surface-300">{reporter.name}</span></div>}
            </DetailRow>

            <DetailRow icon={FolderOpen} label="Project">
              {project ? <Link to={`/projects/${project.id}`} className="text-sm text-brand-600 hover:underline">{project.name}</Link> : <span className="text-sm text-surface-400">No project</span>}
            </DetailRow>

            <DetailRow icon={Calendar} label="Due Date">
              <span className={`text-sm ${overdue ? 'text-danger-500 font-medium' : 'text-surface-700 dark:text-surface-300'}`}>{task.dueDate ? formatDate(task.dueDate) : '—'}</span>
            </DetailRow>

            <DetailRow icon={Clock} label="Est. Hours">
              <span className="text-sm text-surface-700 dark:text-surface-300">{task.estimatedHours}h est / {task.actualHours}h actual</span>
            </DetailRow>

            <DetailRow icon={Flag} label="Status">
              <select value={task.status} onChange={e => updateMutation.mutate({ status: e.target.value })} className="input py-0.5 text-xs w-auto">
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </DetailRow>

            <DetailRow icon={History} label="Version">
              <span className="text-sm text-surface-500">v{task.version}</span>
            </DetailRow>

            <div className="pt-2 border-t border-surface-100 dark:border-surface-700 text-xs text-surface-400">
              <p>Created {formatDate(task.createdAt)}</p>
              <p className="mt-0.5">Updated {formatDate(task.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="text-surface-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-surface-400 mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}
