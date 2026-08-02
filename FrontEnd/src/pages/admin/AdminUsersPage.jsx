import { mockUsers } from '../../mock/users';
import { Avatar, Badge } from '../../components/ui/index';
import { Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const filtered = mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">User Management</h1>
        <button className="btn-primary gap-2"><UserPlus size={14} /> Invite User</button>
      </div>
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input pl-8 text-sm" id="admin-user-search" />
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-50 dark:bg-surface-800/50">
            <tr>
              {['User', 'Role', 'Department', 'Tasks', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-surface-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2"><Avatar src={u.avatar} name={u.name} size="sm" online={u.isOnline} /><div><p className="text-sm font-medium text-surface-900 dark:text-surface-100">{u.name}</p><p className="text-xs text-surface-400">{u.email}</p></div></div>
                </td>
                <td className="px-4 py-3"><Badge variant={u.role === 'owner' ? 'brand' : u.role === 'admin' ? 'warning' : 'surface'} className="text-[10px] capitalize">{u.role}</Badge></td>
                <td className="px-4 py-3 text-sm text-surface-500">{u.department}</td>
                <td className="px-4 py-3 text-sm text-surface-700 dark:text-surface-300">{u.completedTasks}/{u.totalTasks}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${u.isOnline ? 'text-success-600' : 'text-surface-400'}`}>{u.isOnline ? 'Online' : 'Offline'}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => toast.success('Role updated')} className="text-xs text-brand-600 hover:underline">Edit</button>
                    <span className="text-surface-300">·</span>
                    <button onClick={() => toast.error('Demo: cannot delete')} className="text-xs text-danger-500 hover:underline">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
