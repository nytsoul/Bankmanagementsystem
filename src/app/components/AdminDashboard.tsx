import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useBank } from '../context/BankContext';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CreditCard,
  DollarSign,
  History,
  Plus,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function AdminDashboard() {
  const { customers, accounts, transactions, addAccount } = useBank();
  const navigate = useNavigate();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    accountType: 'savings' as 'savings' | 'current',
    balance: 0,
    interestRate: 4.5,
  });

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const activeAccounts = accounts.filter(a => a.status === 'active').length;
  const frozenAccounts = accounts.filter(a => a.status === 'frozen').length;
  const flaggedTransactions = transactions.filter(t => t.isFlagged).length;
  const recentTransactions = transactions.slice(-5).reverse();

  const stats = [
    {
      icon: Users,
      label: 'Total Customers',
      value: customers.length,
      color: 'bg-sky-500',
      lightColor: 'bg-sky-50',
      textColor: 'text-sky-700',
    },
    {
      icon: CreditCard,
      label: 'Active Accounts',
      value: activeAccounts,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      icon: DollarSign,
      label: 'Total Balance',
      value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: 'bg-teal-500',
      lightColor: 'bg-teal-50',
      textColor: 'text-teal-700',
    },
    {
      icon: AlertTriangle,
      label: 'Flagged Transactions',
      value: flaggedTransactions,
      color: 'bg-rose-500',
      lightColor: 'bg-rose-50',
      textColor: 'text-rose-700',
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: 'Open Account',
      description: 'Create a new customer account',
      action: () => setShowAccountModal(true),
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: UserPlus,
      label: 'Add Customer',
      description: 'Register a new customer profile',
      action: () => navigate('/customers'),
      accent: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      icon: History,
      label: 'View Transactions',
      description: 'Monitor recent activity',
      action: () => navigate('/transactions'),
      accent: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: AlertTriangle,
      label: 'Review Fraud',
      description: 'Inspect flagged transactions',
      action: () => navigate('/fraud'),
      accent: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ];

  const adminFeatures = [
    {
      icon: Users,
      title: 'Customer Management',
      detail: 'Create, update, and maintain customer profiles.',
    },
    {
      icon: CreditCard,
      title: 'Account Operations',
      detail: 'Open, freeze, or close customer accounts.',
    },
    {
      icon: History,
      title: 'Transaction Oversight',
      detail: 'Audit deposits, withdrawals, and transfers.',
    },
    {
      icon: ShieldCheck,
      title: 'Fraud Review',
      detail: 'Track flagged transactions and alerts.',
    },
    {
      icon: TrendingUp,
      title: 'Performance Insights',
      detail: 'Monitor balances and activity trends.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAccount({
        ...formData,
        status: 'active',
      });
      toast.success('Account created successfully');
      setShowAccountModal(false);
      setFormData({ customerId: '', accountType: 'savings', balance: 0, interestRate: 4.5 });
    } catch (error) {
      toast.error('Account creation failed', { description: 'Please try again.' });
    }
  };

  const handleCloseModal = () => {
    setShowAccountModal(false);
    setFormData({ customerId: '', accountType: 'savings', balance: 0, interestRate: 4.5 });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Overview of bank operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/90 rounded-xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
                  <p className="text-2xl text-slate-900">{stat.value}</p>
                </div>
                <div className={`${stat.lightColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/90 rounded-xl p-6 border border-sky-100"
        >
          <h3 className="text-lg text-slate-900 mb-2">Quick Actions</h3>
          <p className="text-sm text-slate-600 mb-6">Launch admin workflows with one click.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white/80 p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className={`${action.bg} w-fit rounded-lg p-2`}>
                    <Icon className={`h-5 w-5 ${action.accent}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900">{action.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/90 rounded-xl p-6 border border-sky-100"
        >
          <h3 className="text-lg text-slate-900 mb-2">Admin Capabilities</h3>
          <p className="text-sm text-slate-600 mb-6">The core tools available to administrators.</p>
          <div className="space-y-4">
            {adminFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="bg-slate-100 text-slate-700 rounded-lg p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900">{feature.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{feature.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 rounded-xl p-6 border border-sky-100"
        >
          <h3 className="text-lg text-slate-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const account = accounts.find(a => a.id === transaction.accountId);
              const customer = customers.find(c => c.id === account?.customerId);

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-sky-50/70 rounded-lg hover:bg-sky-100/70 transition-colors"
                >
                  <div>
                    <p className="text-sm text-slate-900">{customer?.name}</p>
                    <p className="text-xs text-slate-500">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      transaction.type === 'deposit' ? 'text-emerald-600' :
                      transaction.type === 'withdrawal' ? 'text-rose-600' :
                      'text-sky-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/90 rounded-xl p-6 border border-sky-100"
        >
          <h3 className="text-lg text-slate-900 mb-4">Account Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-700">Active Accounts</span>
              </div>
              <span className="text-lg text-slate-900">{activeAccounts}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-slate-700">Frozen Accounts</span>
              </div>
              <span className="text-lg text-slate-900">{frozenAccounts}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-slate-700">Flagged Transactions</span>
              </div>
              <span className="text-lg text-slate-900">{flaggedTransactions}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAccountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-xl p-6 w-full max-w-md border border-sky-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-slate-900">Open New Account</h2>
                <button
                  onClick={handleCloseModal}
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
                    onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
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
                      onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
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
                    onClick={handleCloseModal}
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
