import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search, MessageSquare, Book, Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const faqs = [
  { q: 'How do I create a new task?', a: 'Click the "+ New Task" button in the top right, or press Ctrl+N. You can also use the floating action button (FAB) in the bottom right corner.' },
  { q: 'How do I switch between task views?', a: 'Use the view toggle buttons in the Tasks toolbar to switch between List, Grid, and Kanban views.' },
  { q: 'Can I drag tasks between kanban columns?', a: 'Yes! In the Kanban view, you can drag and drop task cards between columns to update their status automatically.' },
  { q: 'How do I invite team members?', a: 'Go to Teams → select a team → click the "Invite Member" button. Enter their email and choose a role.' },
  { q: 'How do I switch between dark and light mode?', a: 'Click the sun/moon icon in the top header, or go to Settings → Appearance, or press Ctrl+Shift+L.' },
  { q: 'How do I use the command palette?', a: 'Press Ctrl+K to open the command palette. You can search for tasks, projects, navigate to pages, and run actions.' },
  { q: 'How do I connect my backend API?', a: 'All API calls are located in the src/services/ directory. Each service file has TODO comments showing exactly where to replace mock data with real API calls.' },
  { q: 'How do I bulk delete or assign tasks?', a: 'In the Task List view, check multiple tasks using the checkboxes. A bulk actions bar will appear at the top with options to delete, assign, or update status.' },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [activeTab, setActiveTab] = useState('faq');

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
          <HelpCircle size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Help Center</h1>
        <p className="text-surface-500">Find answers or get in touch with support</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-700 gap-0">
        {[{ key: 'faq', icon: Book, label: 'FAQ' }, { key: 'support', icon: MessageSquare, label: 'Support' }, { key: 'feedback', icon: Mail, label: 'Feedback' }].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-brand-600 text-brand-600' : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'}`}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>

      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search FAQ..." className="input pl-8" id="faq-search" />
          </div>
          <div className="space-y-2">
            {filteredFaqs.map((faq, i) => (
              <motion.div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
                  id={`faq-${i}`}
                >
                  <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                    <ChevronDown size={16} className="text-surface-400 flex-shrink-0 ml-2" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm text-surface-600 dark:text-surface-400">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            {filteredFaqs.length === 0 && <div className="text-center py-8 text-surface-400 text-sm">No results found for "{search}"</div>}
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: MessageSquare, title: 'Live Chat', desc: 'Chat with our support team (Mon-Fri, 9-5 EST)', action: 'Start Chat', color: 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-700' },
            { icon: Mail, title: 'Email Support', desc: 'Get a detailed response within 24 hours', action: 'Send Email', color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700' },
            { icon: Book, title: 'Documentation', desc: 'Browse detailed guides and API references', action: 'Open Docs', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700' },
            { icon: HelpCircle, title: 'Community', desc: 'Ask questions in our community forum', action: 'Join Community', color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700' },
          ].map(c => (
            <div key={c.title} className={`card p-5 border ${c.color}`}>
              <c.icon size={24} className="text-surface-500 mb-3" />
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-1">{c.title}</h3>
              <p className="text-xs text-surface-500 mb-4">{c.desc}</p>
              <button onClick={() => toast.success('Opening ' + c.title)} className="btn-secondary text-xs">{c.action}</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100">Send Feedback</h3>
          <div>
            <label className="label">Feedback Type</label>
            <select className="input" id="feedback-type">
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>General Feedback</option>
              <option>Performance Issue</option>
            </select>
          </div>
          <div>
            <label className="label">Message</label>
            <textarea value={feedbackMsg} onChange={e => setFeedbackMsg(e.target.value)} rows={5} className="input resize-none" placeholder="Describe your feedback in detail..." id="feedback-message" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-surface-400">Your feedback helps us improve TaskFlow</p>
            <button
              onClick={() => { if (!feedbackMsg.trim()) return toast.error('Enter a message'); toast.success('Feedback submitted! Thank you.'); setFeedbackMsg(''); }}
              className="btn-primary gap-2" id="feedback-submit-btn"
            >
              <Send size={14} /> Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
