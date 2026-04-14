import { useState } from 'react';
import { useBank } from '../context/BankContext';
import { toast } from 'sonner';
import { Plus, Lock, Unlock, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AccountManagement() {
  const { customers, accounts, addAccount, closeAccount, freezeAccount, unfreezeAccount } = useBank();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    accountType: 'savings' as 'savings' | 'current',
    balance: 0,
    interestRate: 4.5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAccount({
        ...formData,
        status: 'active',
      });
      toast.success('Account created successfully');
      setShowModal(false);
      setFormData({ customerId: '', accountType: 'savings', balance: 0, interestRate: 4.5 });
    } catch (error) {
      toast.error('Account creation failed', { description: 'Please try again.' });
    }
  };

  const handleFreeze = async (accountId: string) => {
    try {
      await freezeAccount(accountId);
      toast.success('Account frozen successfully');
    } catch (error) {
      toast.error('Freeze failed', { description: 'Unable to update this account.' });
    }
  };

  const handleUnfreeze = async (accountId: string) => {
    try {
      await unfreezeAccount(accountId);
      toast.success('Account unfrozen successfully');
    } catch (error) {
      toast.error('Unfreeze failed', { description: 'Unable to update this account.' });
    }
  };

  const handleClose = async (accountId: string) => {
    if (confirm('Are you sure you want to close this account?')) {
      try {
        await closeAccount(accountId);
        toast.success('Account closed successfully');
      } catch (error) {
        toast.error('Close failed', { description: 'Unable to close this account.' });
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl text-slate-900 mb-2">Account Management</h1>
          <p className="text-slate-600">Manage all bank accounts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Open Account
        </motion.button>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-sky-50/70 border-b border-sky-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Account Number</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Customer</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Type</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Balance</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Status</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => {
              const customer = customers.find(c => c.id === account.customerId);
              return (
                <motion.tr
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-sky-50 hover:bg-sky-50/60 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-slate-900">{account.accountNumber}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{customer?.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs capitalize">
                      {account.accountType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      account.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {account.status === 'active' ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleFreeze(account.id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Freeze account"
                        >
                          <Lock className="w-4 h-4" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUnfreeze(account.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Unfreeze account"
                        >
                          <Unlock className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleClose(account.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Close account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
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
                <h2 className="text-xl text-slate-900">Open New Account</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-sky-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Select Customer</label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Choose a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({
                      ...formData,
                      accountType: e.target.value as 'savings' | 'current',
                      interestRate: e.target.value === 'savings' ? 4.5 : 0,
                    })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Initial Balance</label>
                  <input
                    type="number"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {formData.accountType === 'savings' && (
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      value={formData.interestRate}
                      onChange={(e) => setFormData({ ...formData, interestRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      min="0"
                      max="20"
                      step="0.1"
                      required
                    />
                  </div>
                )}

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
                    Open Account
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
