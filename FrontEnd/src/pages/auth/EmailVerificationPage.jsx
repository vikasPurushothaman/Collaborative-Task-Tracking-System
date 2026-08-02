import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { authService } from '../../services/authService';

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    authService.verifyEmail('mock_token').then(() => setStatus('success')).catch(() => setStatus('error'));
  }, []);

  return (
    <div className="text-center py-4">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/70">Verifying your email...</p>
        </div>
      )}
      {status === 'success' && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <CheckCircle size={48} className="text-success-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
          <p className="text-brand-300 text-sm mb-6">Your email has been successfully verified.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-xl transition-colors">
            Continue to Sign In
          </button>
        </motion.div>
      )}
      {status === 'error' && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <XCircle size={48} className="text-danger-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-brand-300 text-sm mb-6">Invalid or expired verification link.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-xl transition-colors">
            Back to Sign In
          </button>
        </motion.div>
      )}
    </div>
  );
}
