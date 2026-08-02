import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Brain, List, ArrowRight, Copy, RefreshCw, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from '../../components/ui/index';

const mockGenerate = async (type, input) => {
  await new Promise(r => setTimeout(r, 1500));
  const responses = {
    description: `This task involves ${input}. The goal is to deliver a high-quality solution that meets all requirements while adhering to best practices and maintaining code quality standards. Success will be measured by user acceptance and performance benchmarks.`,
    checklist: ['[ ] Research and gather requirements', '[ ] Create initial design/prototype', '[ ] Implement core functionality', '[ ] Write unit tests', '[ ] Conduct code review', '[ ] Update documentation', '[ ] Deploy and verify'],
    summary: `Task: ${input}. Key objectives: delivery of working solution with testing. Priority: High. Estimated effort: 2-3 days.`,
    priority: 'High - This task has a significant impact on core user experience and should be prioritized accordingly.',
    improve: `Enhanced version: ${input} — focusing on scalability, user experience, and maintainability. Ensure proper error handling, logging, and monitoring are in place before launch.`,
  };
  return responses[type] || 'Generated content would appear here.';
};

const actions = [
  { id: 'description', icon: Brain, label: 'Generate Description', color: 'from-brand-500 to-brand-700', description: 'AI-powered task description from a brief' },
  { id: 'checklist', icon: List, label: 'Generate Checklist', color: 'from-emerald-500 to-emerald-700', description: 'Create actionable subtasks automatically' },
  { id: 'summary', icon: Sparkles, label: 'Summarize Task', color: 'from-purple-500 to-purple-700', description: 'Get a quick executive summary' },
  { id: 'priority', icon: Zap, label: 'Suggest Priority', color: 'from-orange-500 to-red-600', description: 'AI-powered priority recommendation' },
  { id: 'improve', icon: RefreshCw, label: 'Improve Description', color: 'from-pink-500 to-accent-600', description: 'Enhance existing task descriptions' },
];

export default function AiPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  const handleGenerate = async (action) => {
    if (!input.trim()) return toast.error('Enter a task description first');
    setLoading(true);
    setActiveAction(action.id);
    setOutput('');
    try {
      const result = await mockGenerate(action.id, input);
      setOutput(Array.isArray(result) ? result.join('\n') : result);
      toast.success('Generated successfully!');
    } catch { toast.error('Generation failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
          <Brain size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">AI Task Assistant</h1>
        <p className="text-surface-500 dark:text-surface-400">Let AI help you create, improve, and organize your tasks</p>
        <span className="inline-block mt-2 badge-brand text-xs px-3 py-1 rounded-full">Powered by AI · No backend needed for demo</span>
      </motion.div>

      {/* Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
        <label className="label">Task Description or Brief</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={4}
          placeholder="e.g., Build a user authentication system with JWT tokens, refresh token rotation, and OAuth2 support..."
          className="input resize-none text-sm mb-4"
          id="ai-input"
        />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map(action => (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenerate(action)}
              disabled={loading}
              className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${action.color} text-white text-left hover:opacity-90 transition-opacity disabled:opacity-60`}
              id={`ai-${action.id}-btn`}
            >
              {loading && activeAction === action.id ? <Loader size="sm" /> : <action.icon size={18} />}
              <div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs opacity-75">{action.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Output */}
      {(output || loading) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Sparkles size={16} className="text-brand-500" /> AI Output
            </h3>
            {output && (
              <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!'); }} className="btn-ghost text-xs gap-1.5">
                <Copy size={12} /> Copy
              </button>
            )}
          </div>
          {loading ? (
            <div className="flex items-center gap-3 py-4">
              <Loader size="sm" />
              <span className="text-sm text-surface-500 animate-pulse">Generating with AI...</span>
            </div>
          ) : (
            <pre className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap font-sans bg-surface-50 dark:bg-surface-700/50 rounded-xl p-4 leading-relaxed">{output}</pre>
          )}
        </motion.div>
      )}

      {/* Example prompts */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">Example prompts</p>
        <div className="flex flex-wrap gap-2">
          {['Build a search feature with filters', 'Redesign the checkout flow', 'Fix performance issues in dashboard', 'Set up monitoring and alerts'].map(ex => (
            <button key={ex} onClick={() => setInput(ex)} className="text-xs px-3 py-1.5 bg-surface-100 dark:bg-surface-700 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 transition-colors text-surface-600 dark:text-surface-400">
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
