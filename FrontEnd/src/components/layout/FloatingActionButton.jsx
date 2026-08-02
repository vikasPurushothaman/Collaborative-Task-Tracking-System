import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, FolderOpen, Users, X } from 'lucide-react';
import { openModal } from '../../store/slices/uiSlice';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: CheckSquare, label: 'New Task', color: 'bg-brand-600 hover:bg-brand-700', action: 'createTask' },
  { icon: FolderOpen, label: 'New Project', color: 'bg-emerald-600 hover:bg-emerald-700', action: 'createProject' },
  { icon: Users, label: 'New Team', color: 'bg-purple-600 hover:bg-purple-700', action: 'createTeam' },
];

export default function FloatingActionButton() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && actions.map((a, i) => (
          <motion.button
            key={a.action}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => { dispatch(openModal(a.action)); setOpen(false); }}
            className={`flex items-center gap-2 px-4 py-2.5 ${a.color} text-white rounded-full shadow-lg text-sm font-medium transition-all`}
          >
            <a.icon size={16} />
            {a.label}
          </motion.button>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-full shadow-glow flex items-center justify-center transition-all"
        id="fab-btn"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={24} />
        </motion.div>
      </motion.button>
    </div>
  );
}
