import { useEffect, useMemo, useState } from 'react';
import { useBank } from '../context/BankContext';
import { AlertTriangle, CheckCircle2, ClipboardList, DollarSign, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const reviewStorageKey = 'fraudReviewState';
const ruleNoteStorageKey = 'fraudRuleNotes';

type ReviewStatus = 'pending' | 'reviewed' | 'cleared';

interface ReviewState {
  status: ReviewStatus;
  note: string;
}

export function FraudDetection() {
  const { customers, accounts, transactions, logAdminActivity } = useBank();
  const [reviewState, setReviewState] = useState<Record<string, ReviewState>>({});
  const [ruleNotes, setRuleNotes] = useState<Record<string, string>>({});

  const flaggedTransactions = transactions.filter(t => t.isFlagged);

  const fraudRules = [
    { id: 'high-value', icon: DollarSign, label: 'High-value transactions', description: 'Transactions over $50,000', color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'frequent', icon: Activity, label: 'Frequent transactions', description: 'More than 5 transactions per hour', color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'pattern', icon: AlertTriangle, label: 'Unusual patterns', description: 'Detected suspicious activity', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  useEffect(() => {
    const stored = localStorage.getItem(reviewStorageKey);
    if (stored) {
      try {
        setReviewState(JSON.parse(stored) as Record<string, ReviewState>);
      } catch {
        setReviewState({});
      }
    }

    const storedNotes = localStorage.getItem(ruleNoteStorageKey);
    if (storedNotes) {
      try {
        setRuleNotes(JSON.parse(storedNotes) as Record<string, string>);
      } catch {
        setRuleNotes({});
      }
    }
  }, []);

  const updateReviewState = (transactionId: string, patch: Partial<ReviewState>) => {
    setReviewState((prev) => {
      const next = {
        ...prev,
        [transactionId]: {
          status: prev[transactionId]?.status || 'pending',
          note: prev[transactionId]?.note || '',
          ...patch,
        },
      };
      localStorage.setItem(reviewStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const updateRuleNote = (ruleId: string, note: string) => {
    setRuleNotes((prev) => {
      const next = { ...prev, [ruleId]: note };
      localStorage.setItem(ruleNoteStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const reviewSummary = useMemo(() => {
    return flaggedTransactions.reduce((acc, transaction) => {
      const status = reviewState[transaction.id]?.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<ReviewStatus, number>);
  }, [flaggedTransactions, reviewState]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 mb-2">Fraud Detection</h1>
        <p className="text-slate-600">Monitor suspicious transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {fraudRules.map((rule, index) => {
          const Icon = rule.icon;
          return (
            <motion.div
              key={rule.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/90 rounded-xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${rule.bg} p-3 rounded-lg w-fit mb-4`}>
                <Icon className={`w-6 h-6 ${rule.color}`} />
              </div>
              <h3 className="text-lg text-slate-900 mb-2">{rule.label}</h3>
              <p className="text-sm text-slate-600 mb-4">{rule.description}</p>
              <div>
                <label className="block text-xs text-slate-500 mb-2">Rule notes</label>
                <textarea
                  value={ruleNotes[rule.id] || ''}
                  onChange={(event) => {
                    updateRuleNote(rule.id, event.target.value);
                    logAdminActivity({
                      action: 'Updated fraud rule note',
                      detail: rule.label,
                      category: 'fraud',
                    });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  rows={2}
                  placeholder="Add context for reviewers"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl text-slate-900">Flagged Transactions</h2>
            <p className="text-sm text-slate-600 mt-1">Track reviews, notes, and outcomes.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full">{flaggedTransactions.length} Alerts</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">{reviewSummary.pending || 0} Pending</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">{reviewSummary.reviewed || 0} Reviewed</span>
            <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full">{reviewSummary.cleared || 0} Cleared</span>
          </div>
        </div>

        <div className="space-y-3">
          {flaggedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No flagged transactions</p>
            </div>
          ) : (
            flaggedTransactions.map((transaction, index) => {
              const account = accounts.find(a => a.id === transaction.accountId);
              const customer = customers.find(c => c.id === account?.customerId);
              const review = reviewState[transaction.id] || { status: 'pending', note: '' };

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-rose-100 rounded-lg mt-1">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-900 mb-1">{customer?.name}</p>
                        <p className="text-xs text-slate-600 mb-2">{transaction.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span>A/C: {account?.accountNumber}</span>
                          <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-rose-600">
                        ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{transaction.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white/80 border border-rose-100 rounded-lg p-3">
                      <label className="text-xs text-slate-500">Review status</label>
                      <select
                        value={review.status}
                        onChange={(event) => {
                          const status = event.target.value as ReviewStatus;
                          updateReviewState(transaction.id, { status });
                          logAdminActivity({
                            action: 'Updated fraud review status',
                            detail: `${transaction.id} -> ${status}`,
                            category: 'fraud',
                          });
                        }}
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="cleared">Cleared</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 bg-white/80 border border-rose-100 rounded-lg p-3">
                      <label className="text-xs text-slate-500">Reviewer notes</label>
                      <textarea
                        value={review.note}
                        onChange={(event) => updateReviewState(transaction.id, { note: event.target.value })}
                        onBlur={() => logAdminActivity({
                          action: 'Updated fraud review notes',
                          detail: transaction.id,
                          category: 'fraud',
                        })}
                        className="mt-2 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm"
                        rows={2}
                        placeholder="Add review notes for audit trail"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <ClipboardList className="w-4 h-4" />
                    <span>Manual review required</span>
                    {review.status === 'reviewed' && (
                      <span className="ml-auto inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" /> Reviewed
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
