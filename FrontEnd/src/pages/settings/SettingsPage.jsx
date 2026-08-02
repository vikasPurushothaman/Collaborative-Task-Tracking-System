import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Shield, Globe, User, Trash2, LogOut, Monitor } from 'lucide-react';
import { toggleTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { authService } from '../../services/authService';
import { LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '../../constants';

const tabs = [
  { key: 'general', label: 'General', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'appearance', label: 'Appearance', icon: Monitor },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'account', label: 'Account', icon: Trash2 },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector(s => s.ui);
  const { user } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState('general');
  const [deleteModal, setDeleteModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.twoFactorEnabled || false);
  const [notifSettings, setNotifSettings] = useState({ taskAssigned: true, taskDue: true, comments: true, mentions: true, teamUpdates: false, weeklySummary: true });
  const [language, setLanguage] = useState('en');

  const Toggle2FA = async () => {
    const newVal = !twoFAEnabled;
    const r = await authService.toggleTwoFactor(newVal);
    setTwoFAEnabled(newVal);
    toast.success(`2FA ${newVal ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Settings</h1>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Sidebar */}
        <div className="md:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === t.key ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700/50'}`}>
                <t.icon size={15} />{t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 card p-6 space-y-5">
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">Language</label>
                    <select value={language} onChange={e => setLanguage(e.target.value)} className="input max-w-xs" id="settings-language">
                      {LANGUAGE_OPTIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Timezone</label>
                    <select className="input max-w-xs" id="settings-timezone">
                      {TIMEZONE_OPTIONS.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100">Notification Preferences</h3>
              {Object.entries(notifSettings).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-xs text-surface-400">Receive notifications for this event</p>
                  </div>
                  <button
                    onClick={() => setNotifSettings(s => ({ ...s, [key]: !s[key] }))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${val ? 'bg-brand-600' : 'bg-surface-300 dark:bg-surface-600'}`}
                    id={`notif-${key}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${val ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100">Appearance</h3>
              <div>
                <label className="label mb-3">Theme</label>
                <div className="flex gap-3">
                  {[
                    { val: 'light', label: 'Light', icon: Sun },
                    { val: 'dark', label: 'Dark', icon: Moon },
                  ].map(t => (
                    <button
                      key={t.val}
                      onClick={() => { if (theme !== t.val) dispatch(toggleTheme()); }}
                      className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === t.val ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'}`}
                      id={`theme-${t.val}-btn`}
                    >
                      <t.icon size={20} className={theme === t.val ? 'text-brand-600' : 'text-surface-400'} />
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100">Security Settings</h3>
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-surface-900 dark:text-surface-100">Two-Factor Authentication</p>
                  <p className="text-xs text-surface-400 mt-0.5">Add an extra layer of security to your account</p>
                </div>
                <button
                  onClick={Toggle2FA}
                  className={`relative w-11 h-6 rounded-full transition-colors ${twoFAEnabled ? 'bg-brand-600' : 'bg-surface-300 dark:bg-surface-600'}`}
                  id="2fa-toggle"
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${twoFAEnabled ? 'translate-x-5' : ''}`} />
                </button>
              </div>
              <div>
                <button onClick={() => navigate('/profile/change-password')} className="btn-secondary text-sm">Change Password</button>
              </div>
              <div className="p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                <p className="font-medium text-surface-900 dark:text-surface-100 mb-2">Active Sessions</p>
                <div className="space-y-2">
                  {['Chrome · macOS (Current)', 'Safari · iPhone', 'Firefox · Windows'].map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-sm text-surface-600 dark:text-surface-400">{s}</p>
                      {i === 0 ? <span className="badge-success text-xs">Current</span> : <button className="text-xs text-danger-500 hover:underline">Revoke</button>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-5">
              <h3 className="font-semibold text-surface-900 dark:text-surface-100">Account Settings</h3>
              <div className="p-4 border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20 rounded-xl">
                <h4 className="font-medium text-danger-700 dark:text-danger-400 mb-1">Delete Account</h4>
                <p className="text-sm text-danger-600 dark:text-danger-400/80 mb-3">Once you delete your account, there is no going back. All data will be permanently removed.</p>
                <button onClick={() => setDeleteModal(true)} className="btn-danger text-sm" id="delete-account-btn">Delete Account</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account" size="sm" id="delete-account-modal">
        <div className="p-5">
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">This will permanently delete your account and all associated data. This action cannot be undone.</p>
          <p className="text-sm font-medium text-surface-900 dark:text-surface-100 mb-4">Type <strong>DELETE</strong> to confirm:</p>
          <input type="text" placeholder="DELETE" className="input mb-4" id="delete-confirm-input" />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => { toast.error('This is a demo — account deletion disabled'); setDeleteModal(false); }} className="btn-danger">Delete Account</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
