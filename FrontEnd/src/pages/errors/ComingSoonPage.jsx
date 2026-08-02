import { motion } from 'framer-motion';
import { Rocket, Bell } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-surface-900 to-accent-950 p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-bounce-gentle">
          <Rocket size={36} className="text-white" />
        </div>
        <h1 className="text-4xl font-black text-white mb-3">Coming Soon</h1>
        <p className="text-brand-300 mb-8">We're working on something amazing. Be the first to know when we launch!</p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="input flex-1 bg-white/10 border-white/20 text-white placeholder-white/40 focus:ring-brand-400" id="coming-soon-email" />
          <button onClick={() => { if (email) { toast.success('You\'re on the list!'); setEmail(''); } else toast.error('Enter email'); }} className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-lg transition-colors flex items-center gap-1.5 text-sm" id="coming-soon-notify-btn">
            <Bell size={14} /> Notify Me
          </button>
        </div>
      </motion.div>
    </div>
  );
}
