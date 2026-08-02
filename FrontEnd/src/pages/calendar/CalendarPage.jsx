import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockTasks } from '../../mock/tasks';
import { Badge } from '../../components/ui/index';
import { STATUS_LABELS, PRIORITY_LABELS } from '../../constants';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [view, setView] = useState('month');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDay = (day) =>
    mockTasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));

  const selectedDayTasks = getTasksForDay(selectedDay);

  const priorityDot = { urgent: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-surface-100">Calendar</h1>
          <p className="text-sm text-surface-500">Task deadline overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden text-xs">
            {['month', 'week'].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 capitalize ${view === v ? 'bg-brand-600 text-white' : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-700/50'}`}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-2 card p-5">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="btn-icon"><ChevronLeft size={16} /></button>
            <h2 className="font-semibold text-surface-900 dark:text-surface-100">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="btn-icon"><ChevronRight size={16} /></button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-surface-400 py-1">{d}</div>
            ))}
          </div>

          {/* Fill empty days at start */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthStart.getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const tasks = getTasksForDay(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDay);
              return (
                <motion.button
                  key={day.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedDay(day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-start pt-1.5 text-sm transition-all ${isSelected ? 'bg-brand-600 text-white shadow-glow' : isToday ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-bold' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700/50'}`}
                >
                  <span className="font-medium text-xs">{format(day, 'd')}</span>
                  {tasks.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center px-0.5">
                      {tasks.slice(0, 3).map(t => (
                        <span key={t.id} className={`w-1.5 h-1.5 rounded-full ${priorityDot[t.priority]} ${isSelected ? 'bg-white/70' : ''}`} />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Day Tasks Sidebar */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">{format(selectedDay, 'MMM d, yyyy')}</h3>
            <span className="badge-brand text-xs">{selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? 's' : ''}</span>
          </div>

          {selectedDayTasks.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={24} className="mx-auto text-surface-300 mb-2" />
              <p className="text-xs text-surface-400">No tasks due on this day</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedDayTasks.map(t => (
                <div key={t.id} className="p-3 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[t.priority]}`} />
                    <p className="text-xs font-medium text-surface-900 dark:text-surface-100 truncate">{t.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={t.status} className="text-[10px]">{STATUS_LABELS[t.status]}</Badge>
                    <Badge variant={t.priority} className="text-[10px]">{PRIORITY_LABELS[t.priority]}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming tasks (next 7 days) */}
          <div className="mt-5 pt-4 border-t border-surface-200 dark:border-surface-700">
            <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Upcoming (7 days)</h4>
            <div className="space-y-2">
              {mockTasks.filter(t => {
                if (!t.dueDate || t.status === 'completed') return false;
                const due = parseISO(t.dueDate);
                const now = new Date();
                const in7 = new Date(now); in7.setDate(in7.getDate() + 7);
                return due >= now && due <= in7;
              }).slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[t.priority]}`} />
                  <span className="text-surface-600 dark:text-surface-400 truncate flex-1">{t.title}</span>
                  <span className="text-surface-400 flex-shrink-0">{format(parseISO(t.dueDate), 'MMM d')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
