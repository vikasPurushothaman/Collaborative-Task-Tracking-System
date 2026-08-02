import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { getPasswordStrength } from '../../utils';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(v => v, 'You must accept the terms'),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwd, setPwd] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm({ resolver: zodResolver(schema) });
  const strength = getPasswordStrength(watch('password') || '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register(data);
      toast.success('Account created! Please verify your email.');
      navigate('/verify-email');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Create an account</h2>
      <p className="text-brand-300 text-sm mb-6">Join thousands of teams using TaskFlow</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label text-white/80">Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input {...register('name')} type="text" id="reg-name" placeholder="John Doe" className="input pl-9 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400" />
          </div>
          {errors.name && <p className="text-xs text-red-300 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label text-white/80">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input {...register('email')} type="email" id="reg-email" placeholder="you@example.com" className="input pl-9 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400" />
          </div>
          {errors.email && <p className="text-xs text-red-300 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label text-white/80">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              {...register('password', { onChange: e => setPwd(e.target.value) })}
              type={showPwd ? 'text' : 'password'}
              id="reg-password"
              placeholder="Min. 8 characters"
              className="input pl-9 pr-10 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400"
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {watch('password') && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.color : 'bg-white/20'}`} />
                ))}
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
            <input {...register('confirmPassword')} type="password" id="reg-confirm-password" placeholder="Repeat password" className="input pl-9 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400" />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-300 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input {...register('terms')} type="checkbox" id="reg-terms" className="mt-0.5 w-4 h-4 rounded border-white/30 bg-white/10 text-brand-500" />
          <span className="text-sm text-white/70">I agree to the <a href="#" className="text-white underline">Terms of Service</a> and <a href="#" className="text-white underline">Privacy Policy</a></span>
        </label>
        {errors.terms && <p className="text-xs text-red-300">{errors.terms.message}</p>}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          id="register-submit-btn"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus size={16} /> Create Account</>}
        </motion.button>
      </form>

      <p className="text-center text-sm text-brand-300 mt-4">
        Already have an account? <Link to="/login" className="text-white font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
