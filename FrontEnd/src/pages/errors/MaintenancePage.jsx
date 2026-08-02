import { motion } from 'framer-motion';
import { Wrench, Clock } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 to-surface-950 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
          <Wrench size={36} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Under Maintenance</h1>
        <p className="text-brand-300 mb-6">We're performing scheduled maintenance to improve your experience. We'll be back shortly!</p>
        <div className="flex items-center justify-center gap-2 text-brand-300 text-sm">
          <Clock size={14} />
          <span>Estimated downtime: 2 hours</span>
        </div>
        <div className="mt-8 flex justify-center gap-1">
          {[1,2,3].map(i => <div key={i} className={`w-2 h-2 bg-brand-400 rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />)}
        </div>
      </motion.div>
    </div>
  );
}
