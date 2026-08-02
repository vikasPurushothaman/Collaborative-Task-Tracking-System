import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { getPasswordStrength } from '../../utils';

const schema = z.object({
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const strength = getPasswordStrength(watch('password') || '');

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authService.resetPassword('mock_token', password);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch { toast.error('Reset failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Reset password</h2>
      <p className="text-brand-300 text-sm mb-6">Enter your new password below.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label text-white/80">New Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input {...register('password')} type={showPwd ? 'text' : 'password'} id="reset-password" placeholder="New password" className="input pl-9 pr-10 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400" />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {watch('password') && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-white/20'}`} />)}
              </div>
              <p className="text-xs text-white/50">{strength.label}</p>
            </div>
          )}
          {errors.password && <p className="text-xs text-red-300 mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="label text-white/80">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input {...register('confirmPassword')} type="password" id="reset-confirm" placeholder="Confirm password" className="input pl-9 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400" />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-300 mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={loading} id="reset-submit-btn" className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
        </button>
      </form>
      <p className="text-center text-sm text-brand-300 mt-4">
        <Link to="/login" className="text-white hover:underline">Back to Sign In</Link>
      </p>
    </div>
  );
}
