import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff, Home } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-8xl font-black text-danger-100 dark:text-danger-900 mb-4 select-none">403</div>
        <div className="w-20 h-20 bg-danger-50 dark:bg-danger-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={36} className="text-danger-400" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Access Forbidden</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8">You don't have permission to access this page. Contact your admin if you think this is a mistake.</p>
        <Link to="/dashboard" className="btn-primary gap-2 inline-flex"><Home size={14} /> Back to Dashboard</Link>
      </motion.div>
    </div>
  );
}
