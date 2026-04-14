import { useMemo, useState } from 'react';
import { useBank } from '../context/BankContext';
import { ClipboardList, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const categories = ['all', 'customer', 'account', 'transaction', 'fraud', 'role', 'system'] as const;

type CategoryFilter = typeof categories[number];

export function AdminActivityLog() {
  const { activityLog, clearActivityLog } = useBank();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLog = useMemo(() => {
    return activityLog.filter((entry) => {
      const matchesCategory = filter === 'all' || entry.category === filter;
      const matchesSearch = !searchTerm.trim()
        || `${entry.action} ${entry.detail} ${entry.actor}`.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activityLog, filter, searchTerm]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 mb-2">Admin Activity Log</h1>
        <p className="text-slate-600">Track who performed critical actions and when.</p>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="text-sm text-slate-700">Filter by category:</span>
          </div>
          <button
            onClick={clearActivityLog}
            className="text-xs text-rose-600 hover:text-rose-700"
          >
            Clear log
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category)}
              className={`px-3 py-2 rounded-lg capitalize transition-colors ${
                filter === category
                  ? 'bg-teal-600 text-white'
                  : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
        <div className="mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by action, detail, or user"
            className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6">
        {filteredLog.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No activity recorded yet.</div>
        ) : (
          <div className="space-y-3">
            {filteredLog.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <ClipboardList className="w-5 h-5 text-slate-600 mt-1" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-slate-900">{entry.action}</span>
                    <span className="text-xs uppercase text-slate-500">{entry.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{entry.detail}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>By {entry.actor}</span>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
