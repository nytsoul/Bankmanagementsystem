import { useBank } from '../context/BankContext';
import { CreditCard, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export function CustomerDashboard() {
  const { currentUser, customers, accounts, transactions } = useBank();

  const customer = customers.find(c => c.id === currentUser?.customerId);
  const customerAccounts = accounts.filter(a => a.customerId === currentUser?.customerId);
  const customerTransactions = transactions.filter(t =>
    customerAccounts.some(acc => acc.id === t.accountId)
  );

  const totalBalance = customerAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  const deposits = customerTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const withdrawals = customerTransactions
    .filter(t => t.type === 'withdrawal' || t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = customerTransactions.slice(-5).reverse();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 mb-2">Welcome, {customer?.name}</h1>
        <p className="text-slate-600">Manage your accounts and transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl p-6 text-white shadow-lg"
        >
          <p className="text-sm opacity-90 mb-2">Total Balance</p>
          <p className="text-3xl mb-4">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <div className="flex items-center gap-2 text-sm opacity-90">
            <CreditCard className="w-4 h-4" />
            <span>{customerAccounts.length} Accounts</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="bg-white/90 rounded-xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-50 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm text-slate-600">Total Deposits</p>
          </div>
          <p className="text-2xl text-slate-900">${deposits.toLocaleString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="bg-white/90 rounded-xl p-6 border border-sky-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-rose-50 p-2 rounded-lg">
              <TrendingDown className="w-5 h-5 text-rose-600" />
            </div>
            <p className="text-sm text-slate-600">Total Withdrawals</p>
          </div>
          <p className="text-2xl text-slate-900">${withdrawals.toLocaleString()}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 rounded-xl p-6 border border-sky-100"
        >
          <h3 className="text-lg text-slate-900 mb-4">My Accounts</h3>
          <div className="space-y-3">
            {customerAccounts.map((account) => (
              <motion.div
                key={account.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gradient-to-r from-sky-50 to-emerald-50 rounded-lg border border-sky-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 capitalize">{account.accountType} Account</span>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    account.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {account.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">A/C: {account.accountNumber}</p>
                <p className="text-xl text-slate-900">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/90 rounded-xl p-6 border border-sky-100"
        >
          <h3 className="text-lg text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No transactions yet</p>
            ) : (
              recentTransactions.map((transaction) => {
                const account = customerAccounts.find(a => a.id === transaction.accountId);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-sky-50/70 rounded-lg hover:bg-sky-100/70 transition-colors"
                  >
                    <div>
                      <p className="text-sm text-slate-900">{transaction.description}</p>
                      <p className="text-xs text-slate-500">
                        {account?.accountNumber} • {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-sm ${
                      transaction.type === 'deposit' ? 'text-emerald-600' :
                      transaction.type === 'withdrawal' ? 'text-rose-600' :
                      'text-sky-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
