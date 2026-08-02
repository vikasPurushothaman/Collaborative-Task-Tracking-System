import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { closeShortcutsModal } from '../../store/slices/uiSlice';
import { KEYBOARD_SHORTCUTS } from '../../constants';

export default function KeyboardShortcutsModal() {
  const dispatch = useDispatch();
  const categories = [...new Set(KEYBOARD_SHORTCUTS.map(s => s.category))];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => dispatch(closeShortcutsModal())}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg card shadow-modal overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-2">
            <Keyboard size={18} className="text-brand-600" />
            <h2 className="font-semibold text-surface-900 dark:text-surface-100">Keyboard Shortcuts</h2>
          </div>
          <button onClick={() => dispatch(closeShortcutsModal())} className="btn-icon"><X size={16} /></button>
        </div>
        <div className="p-5 max-h-96 overflow-y-auto space-y-4">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">{cat}</h3>
              <div className="space-y-1.5">
                {KEYBOARD_SHORTCUTS.filter(s => s.category === cat).map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-surface-700 dark:text-surface-300">{s.description}</span>
                    <kbd className="text-xs bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded border border-surface-200 dark:border-surface-600 text-surface-500 font-mono">{s.key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
