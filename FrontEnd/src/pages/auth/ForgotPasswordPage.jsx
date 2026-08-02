import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { motion } from 'framer-motion';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch { toast.error('Failed to send reset link'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {sent ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
          <div className="w-16 h-16 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-success-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-brand-300 text-sm mb-6">We've sent password reset instructions to your email address.</p>
          <Link to="/login" className="text-brand-300 hover:text-white text-sm flex items-center justify-center gap-1">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </motion.div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-white mb-1">Forgot password?</h2>
          <p className="text-brand-300 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label text-white/80">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input {...register('email')} type="email" id="forgot-email" placeholder="you@example.com" className="input pl-9 bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-brand-400" />
              </div>
              {errors.email && <p className="text-xs text-red-300 mt-1">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={loading} id="forgot-submit-btn" className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
            </button>
            <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-brand-300 hover:text-white mt-2">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </form>
        </>
      )}
    </div>
  );
}
