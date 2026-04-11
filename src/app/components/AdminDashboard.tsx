import { useBank } from '../context/BankContext';
import { Users, CreditCard, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const { customers, accounts, transactions } = useBank();

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
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: CreditCard,
      label: 'Active Accounts',
      value: activeAccounts,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      icon: DollarSign,
      label: 'Total Balance',
      value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      icon: AlertTriangle,
      label: 'Flagged Transactions',
      value: flaggedTransactions,
      color: 'bg-red-500',
      lightColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of bank operations</p>
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
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-2xl text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.lightColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => {
              const account = accounts.find(a => a.id === transaction.accountId);
              const customer = customers.find(c => c.id === account?.customerId);

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm text-gray-800">{customer?.name}</p>
                    <p className="text-xs text-gray-500">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${
                      transaction.type === 'deposit' ? 'text-green-600' :
                      transaction.type === 'withdrawal' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
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
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg text-gray-800 mb-4">Account Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Active Accounts</span>
              </div>
              <span className="text-lg text-gray-800">{activeAccounts}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Frozen Accounts</span>
              </div>
              <span className="text-lg text-gray-800">{frozenAccounts}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Flagged Transactions</span>
              </div>
              <span className="text-lg text-gray-800">{flaggedTransactions}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
