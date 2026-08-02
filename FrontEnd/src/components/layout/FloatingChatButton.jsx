import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export default function FloatingChatButton() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');

  return (
    <div className="fixed bottom-24 right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-3 w-72 card shadow-modal overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-brand-600 text-white">
              <div>
                <p className="font-semibold text-sm">Support Chat</p>
                <p className="text-xs text-brand-200">We typically reply in minutes</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-brand-700 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 h-48 bg-surface-50 dark:bg-surface-800/50 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={32} className="mx-auto text-surface-300 mb-2" />
                <p className="text-sm text-surface-500 dark:text-surface-400">Start a conversation</p>
              </div>
            </div>
            <div className="p-3 border-t border-surface-200 dark:border-surface-700 flex gap-2">
              <input
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder="Type a message..."
                className="input text-xs"
              />
              <button className="btn-primary p-2 rounded-lg flex-shrink-0">
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="w-12 h-12 bg-surface-800 dark:bg-surface-200 text-white dark:text-surface-900 rounded-full shadow-lg flex items-center justify-center"
        id="chat-btn"
      >
        <MessageCircle size={20} />
      </motion.button>
    </div>
  );
}
