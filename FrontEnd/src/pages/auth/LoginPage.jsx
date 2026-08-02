import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { setUser, setToken } from '../../store/slices/authSlice';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: 'alex.johnson@taskflow.io', password: 'password123' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      dispatch(setUser(res.data.user));
      dispatch(setToken(res.data.token));
      toast.success('Welcome back, ' + res.data.user.name.split(' ')[0] + '!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
      <p className="text-brand-300 text-sm mb-6">Sign in to your TaskFlow account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label text-white/80">Email address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              {...register('email')}
              type="email"
              id="login-email"
              placeholder="you@example.com"
              className="input pl-9 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400 focus:border-brand-400"
            />
          </div>
          {errors.email && <p className="text-xs text-red-300 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label text-white/80">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              {...register('password')}
              type={showPwd ? 'text' : 'password'}
              id="login-password"
              placeholder="••••••••"
              className="input pl-9 pr-10 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400"
            />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-300 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('rememberMe')} type="checkbox" id="remember-me" className="w-4 h-4 rounded border-white/30 bg-white/10 text-brand-500" />
            <span className="text-sm text-white/70">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-brand-300 hover:text-white transition-colors">
            Forgot password?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          id="login-submit-btn"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn size={16} />
              Sign In
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-brand-300 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-white font-medium hover:underline">Sign up for free</Link>
        </p>
      </div>

      {/* Demo credentials hint */}
      <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
        <p className="text-xs text-white/50 text-center">🔑 Demo: pre-filled with mock credentials</p>
      </div>
    </div>
  );
}
