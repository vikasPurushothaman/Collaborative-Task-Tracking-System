import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-8xl font-black text-brand-100 dark:text-brand-900 mb-4 select-none">404</div>
        <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Search size={36} className="text-brand-400" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Page not found</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-8">Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.history.back()} className="btn-secondary gap-2"><ArrowLeft size={14} /> Go Back</button>
          <Link to="/dashboard" className="btn-primary gap-2"><Home size={14} /> Dashboard</Link>
        </div>
      </motion.div>
    </div>
  );
}
