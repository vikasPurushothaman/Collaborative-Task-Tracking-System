// Reusable UI Components

// Badge
export function Badge({ variant = 'default', children, className = '' }) {
  const variants = {
    default: 'badge-surface',
    brand: 'badge-brand',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    urgent: 'badge priority-urgent text-xs px-2 py-0.5 rounded-full font-medium',
    high: 'badge priority-high text-xs px-2 py-0.5 rounded-full font-medium',
    medium: 'badge priority-medium text-xs px-2 py-0.5 rounded-full font-medium',
    low: 'badge priority-low text-xs px-2 py-0.5 rounded-full font-medium',
    open: 'badge status-open text-xs px-2 py-0.5 rounded-full font-medium',
    in_progress: 'badge status-in-progress text-xs px-2 py-0.5 rounded-full font-medium',
    completed: 'badge status-completed text-xs px-2 py-0.5 rounded-full font-medium',
    blocked: 'badge status-blocked text-xs px-2 py-0.5 rounded-full font-medium',
    cancelled: 'badge status-cancelled text-xs px-2 py-0.5 rounded-full font-medium',
  };
  return <span className={`${variants[variant] || variants.default} ${className}`}>{children}</span>;
}

// Avatar
export function Avatar({ src, name, size = 'md', online = false, className = '' }) {
  const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-xl' };
  const initials = name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '?';
  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-surface-800`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-surface-800`}>
          {initials}
        </div>
      )}
      {online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-surface-800" />}
    </div>
  );
}

// Progress Bar
export function ProgressBar({ value, max = 100, color = 'brand', size = 'md', showLabel = false, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = { brand: 'bg-brand-500', success: 'bg-success-500', warning: 'bg-warning-500', danger: 'bg-danger-500', gradient: 'bg-gradient-to-r from-brand-500 to-accent-500' };
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  return (
    <div className={`w-full ${className}`}>
      {showLabel && <div className="flex justify-between text-xs text-surface-500 mb-1"><span>Progress</span><span>{Math.round(pct)}%</span></div>}
      <div className={`w-full ${heights[size]} bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden`}>
        <div className={`${heights[size]} ${colors[color] || colors.brand} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Skeleton
export function Skeleton({ className = '', lines = 1 }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-4 rounded ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

// Stat Card
export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'brand', loading = false }) {
  const colors = {
    brand: 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
    success: 'bg-success-50 dark:bg-success-500/20 text-success-600 dark:text-success-400',
    warning: 'bg-warning-50 dark:bg-warning-500/20 text-warning-600 dark:text-warning-400',
    danger: 'bg-danger-50 dark:bg-danger-500/20 text-danger-600 dark:text-danger-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };
  if (loading) return <div className="card p-5"><SkeletonCard /></div>;
  return (
    <div className="card p-5 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          {Icon && <Icon size={20} />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400' : 'bg-danger-50 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{value}</p>
        <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-surface-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

// Empty State
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-2xl flex items-center justify-center mb-4"><Icon size={32} className="text-surface-400" /></div>}
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">{title}</h3>
      {description && <p className="text-surface-500 dark:text-surface-400 text-sm max-w-xs mb-6">{description}</p>}
      {action && action}
    </div>
  );
}

// Tooltip
export function Tooltip({ content, children, position = 'top' }) {
  const pos = { top: 'bottom-full left-1/2 -translate-x-1/2 mb-2', bottom: 'top-full left-1/2 -translate-x-1/2 mt-2', left: 'right-full top-1/2 -translate-y-1/2 mr-2', right: 'left-full top-1/2 -translate-y-1/2 ml-2' };
  return (
    <div className="relative group inline-flex">
      {children}
      <div className={`absolute ${pos[position]} z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap`}>
        <span className="bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 text-xs px-2 py-1 rounded-md shadow-lg">{content}</span>
      </div>
    </div>
  );
}

// Loader
export function Loader({ size = 'md', center = false }) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' };
  return (
    <div className={center ? 'flex items-center justify-center py-12' : 'inline-flex'}>
      <div className={`${sizes[size]} border-brand-200 dark:border-brand-800 border-t-brand-600 dark:border-t-brand-400 rounded-full animate-spin`} />
    </div>
  );
}

// Alert
export function Alert({ type = 'info', title, children, onClose }) {
  const styles = {
    info: 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800 text-brand-800 dark:text-brand-300',
    success: 'bg-success-50 dark:bg-success-500/10 border-success-200 dark:border-success-800 text-success-800 dark:text-success-300',
    warning: 'bg-warning-50 dark:bg-warning-500/10 border-warning-200 dark:border-warning-800 text-warning-800 dark:text-warning-300',
    error: 'bg-danger-50 dark:bg-danger-500/10 border-danger-200 dark:border-danger-800 text-danger-800 dark:text-danger-300',
  };
  return (
    <div className={`border rounded-xl p-4 ${styles[type]}`} role="alert">
      <div className="flex items-start justify-between gap-2">
        <div>
          {title && <p className="font-medium mb-1">{title}</p>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100 flex-shrink-0"><X size={14} /></button>}
      </div>
    </div>
  );
}

import { X } from 'lucide-react';
