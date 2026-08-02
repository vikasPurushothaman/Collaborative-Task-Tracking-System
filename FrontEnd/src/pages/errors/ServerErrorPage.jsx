import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-8xl font-black text-warning-100 dark:text-warning-900/50 mb-4 select-none">500</div>
        <div className="w-20 h-20 bg-warning-50 dark:bg-warning-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-warning-400" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Server Error</h1>
        <p className="text-surface-500 mb-8">Something went wrong on our end. We're working to fix it. Please try again in a moment.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.location.reload()} className="btn-secondary gap-2"><RefreshCw size={14} /> Try Again</button>
          <Link to="/dashboard" className="btn-primary gap-2 inline-flex"><Home size={14} /> Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
}
