import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Users, Lock, Edit2, Trash2, Mail, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { teamService } from '../../services/teamService';
import { Avatar, Badge, EmptyState, SkeletonCard } from '../../components/ui/index';
import Modal from '../../components/ui/Modal';
import { mockUsers } from '../../mock/users';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';

const teamSchema = z.object({ name: z.string().min(2), description: z.string().optional(), color: z.string().default('#6172f3'), icon: z.string().default('👥'), isPrivate: z.boolean().default(false) });

export default function TeamsPage() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');

  const { data, isLoading } = useQuery({ queryKey: ['teams'], queryFn: teamService.getAll, select: d => d.data });
  const deleteMutation = useMutation({ mutationFn: teamService.delete, onSuccess: () => { toast.success('Team deleted'); qc.invalidateQueries(['teams']); setDeleteId(null); } });

  const teams = data?.teams || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Teams</h1>
          <p className="text-sm text-surface-500">{teams.length} teams</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="btn-primary gap-2" id="create-team-btn"><Plus size={14} /> New Team</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
      ) : teams.length === 0 ? (
        <EmptyState icon={Users} title="No teams yet" description="Create teams to organize your workforce" action={<button onClick={() => setCreateOpen(true)} className="btn-primary">Create Team</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, i) => {
            const members = mockUsers.filter(u => team.memberIds.includes(u.id));
            const onlineCount = members.filter(m => m.isOnline).length;
            return (
              <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-5 hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: team.color + '20' }}>{team.icon}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link to={`/teams/${team.id}`} className="font-semibold text-surface-900 dark:text-surface-100 hover:text-brand-600 transition-colors text-sm">{team.name}</Link>
                        {team.isPrivate && <Lock size={11} className="text-surface-400" />}
                      </div>
                      <p className="text-xs text-surface-400">{team.memberIds.length} members · {onlineCount} online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setInviteOpen(team.id)} className="btn-icon p-1.5"><UserPlus size={13} /></button>
                    <button onClick={() => setDeleteId(team.id)} className="btn-icon p-1.5 text-danger-400"><Trash2 size={13} /></button>
                  </div>
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-4">{team.description}</p>
                {team.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {team.tags.map(t => <span key={t} className="badge-surface text-[10px] px-1.5 py-0.5 rounded-full">{t}</span>)}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {members.slice(0, 5).map(m => <Avatar key={m.id} src={m.avatar} name={m.name} size="xs" online={m.isOnline} className="ring-2 ring-white dark:ring-surface-800" />)}
                    {members.length > 5 && <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center text-[10px] -ml-1 ring-2 ring-white dark:ring-surface-800">+{members.length - 5}</div>}
                  </div>
                  <div className="text-xs text-surface-400 flex items-center gap-3">
                    <span>{team.activeTasks} active</span>
                    <span className="text-success-500">{team.completedTasks} done</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Team Modal */}
      <TeamFormModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onSuccess={() => { setCreateOpen(false); qc.invalidateQueries(['teams']); toast.success('Team created!'); }} />

      {/* Invite Modal */}
      <Modal isOpen={!!inviteOpen} onClose={() => setInviteOpen(null)} title="Invite Member" size="sm" id="invite-modal">
        <div className="p-5 space-y-4">
          <div>
            <label className="label">Email address</label>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} type="email" placeholder="colleague@company.com" className="input" id="invite-email" />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" id="invite-role">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setInviteOpen(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => { teamService.inviteMember(inviteOpen, inviteEmail).then(() => toast.success('Invitation sent!')); setInviteOpen(null); setInviteEmail(''); }} className="btn-primary gap-2" id="send-invite-btn"><Mail size={14} /> Send Invite</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Team" size="sm">
        <div className="p-5">
          <p className="text-sm text-surface-500 mb-5">This will permanently delete the team and remove all members.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => deleteMutation.mutate(deleteId)} className="btn-danger">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function TeamFormModal({ isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(teamSchema), defaultValues: { icon: '👥', color: '#6172f3', isPrivate: false } });
  const onSubmit = async (data) => { try { await teamService.create({ ...data, memberIds: [], ownerId: 'u1', admins: ['u1'], projectIds: [] }); reset(); onSuccess(); } catch { toast.error('Failed'); } };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Team" size="md" id="team-form-modal">
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div><label className="label">Icon</label><input {...register('icon')} className="input text-xl text-center" maxLength={2} /></div>
          <div className="col-span-3"><label className="label">Team Name *</label><input {...register('name')} className={`input ${errors.name ? 'input-error' : ''}`} placeholder="Engineering Core" id="team-name" />{errors.name && <p className="text-xs text-danger-500 mt-1">{errors.name.message}</p>}</div>
        </div>
        <div><label className="label">Description</label><textarea {...register('description')} rows={2} className="input resize-none" placeholder="What does this team do?" id="team-description" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Color</label><input {...register('color')} type="color" className="input h-9 p-1 cursor-pointer" /></div>
          <div className="flex items-end pb-2"><label className="flex items-center gap-2 cursor-pointer"><input {...register('isPrivate')} type="checkbox" className="rounded" id="team-private" /><span className="text-sm text-surface-700 dark:text-surface-300">Private team</span></label></div>
        </div>
        <div className="flex gap-3 justify-end border-t border-surface-100 dark:border-surface-700 pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary" id="team-submit">Create Team</button>
        </div>
      </form>
    </Modal>
  );
}
