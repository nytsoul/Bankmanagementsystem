import { useState } from 'react';
import { useBank } from '../context/BankContext';
import { toast } from 'sonner';
import { Plus, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ScheduledTransactions() {
  const { currentUser, accounts, scheduledTransactions, addScheduledTransaction } = useBank();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    accountId: '',
    toAccountId: '',
    amount: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
    description: '',
  });

  const customerAccounts = accounts.filter(a => a.customerId === currentUser?.customerId);
  const customerScheduled = scheduledTransactions.filter(st =>
    customerAccounts.some(acc => acc.id === st.accountId)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextDate = new Date();
    if (formData.frequency === 'daily') {
      nextDate.setDate(nextDate.getDate() + 1);
    } else if (formData.frequency === 'weekly') {
      nextDate.setDate(nextDate.getDate() + 7);
    } else {
      nextDate.setDate(nextDate.getDate() + 30);
    }

    try {
      await addScheduledTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        nextExecutionDate: nextDate.toISOString(),
        isActive: true,
      });

      toast.success('Scheduled transaction created');
      setShowModal(false);
      setFormData({
        accountId: '',
        toAccountId: '',
        amount: '',
        frequency: 'monthly',
        description: '',
      });
    } catch (error) {
      toast.error('Schedule failed', { description: 'Please try again.' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-slate-900 mb-2">Scheduled Transactions</h1>
          <p className="text-slate-600">Set up automatic recurring payments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Schedule Payment
        </motion.button>
      </div>

      <div className="space-y-4">
        {customerScheduled.length === 0 ? (
          <div className="bg-white/90 rounded-xl border border-sky-100 p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">No scheduled transactions</p>
          </div>
        ) : (
          customerScheduled.map((scheduled, index) => {
            const fromAccount = customerAccounts.find(a => a.id === scheduled.accountId);
            const toAccount = accounts.find(a => a.id === scheduled.toAccountId);

            return (
              <motion.div
                key={scheduled.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/90 rounded-xl border border-sky-100 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-sky-50 rounded-lg">
                      <Calendar className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 mb-1">{scheduled.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>From: {fromAccount?.accountNumber}</span>
                        <span>To: {toAccount?.accountNumber}</span>
                        <span className="capitalize">{scheduled.frequency}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Next: {new Date(scheduled.nextExecutionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-slate-900">
                      ${scheduled.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs mt-2 ${
                      scheduled.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {scheduled.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-sky-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-slate-900">Schedule Payment</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">From Account</label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Choose an account</option>
                    {customerAccounts.map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountNumber} (${acc.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">To Account</label>
                  <select
                    value={formData.toAccountId}
                    onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Choose destination</option>
                    {accounts
                      .filter(acc => acc.id !== formData.accountId)
                      .map(acc => (
                        <option key={acc.id} value={acc.id}>
                          {acc.accountNumber}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-sky-200 text-slate-700 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
