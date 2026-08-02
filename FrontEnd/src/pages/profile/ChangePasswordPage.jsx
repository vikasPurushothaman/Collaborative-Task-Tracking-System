import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { getPasswordStrength } from '../../utils';

const schema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const strength = getPasswordStrength(watch('newPassword') || '');

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      navigate('/profile');
    } catch { toast.error('Current password is incorrect'); }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-5">Change Password</h1>
      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input {...register('currentPassword')} type={showCurrent ? 'text' : 'password'} className={`input pl-8 pr-10 ${errors.currentPassword ? 'input-error' : ''}`} id="current-password" />
              <button type="button" onClick={() => setShowCurrent(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">{showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
            {errors.currentPassword && <p className="text-xs text-danger-500 mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="label">New Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input {...register('newPassword')} type={showNew ? 'text' : 'password'} className={`input pl-8 pr-10 ${errors.newPassword ? 'input-error' : ''}`} id="new-password" />
              <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">{showNew ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
            {watch('newPassword') && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">{[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-surface-200 dark:bg-surface-700'}`} />)}</div>
                <p className="text-xs text-surface-500">{strength.label}</p>
              </div>
            )}
            {errors.newPassword && <p className="text-xs text-danger-500 mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input {...register('confirmPassword')} type="password" className={`input pl-8 ${errors.confirmPassword ? 'input-error' : ''}`} id="confirm-new-password" />
            </div>
            {errors.confirmPassword && <p className="text-xs text-danger-500 mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => navigate('/profile')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary" id="change-password-submit">
              {isSubmitting ? 'Saving...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
