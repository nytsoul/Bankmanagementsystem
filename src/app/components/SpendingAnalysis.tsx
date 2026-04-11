import { useBank } from '../context/BankContext';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';

export function SpendingAnalysis() {
  const { currentUser, accounts, transactions } = useBank();

  const customerAccounts = accounts.filter(a => a.customerId === currentUser?.customerId);
  const customerTransactions = transactions.filter(t =>
    customerAccounts.some(acc => acc.id === t.accountId)
  );

  const totalDeposits = customerTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = customerTransactions
    .filter(t => t.type === 'withdrawal' || t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);

  const netChange = totalDeposits - totalWithdrawals;

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      deposits: Math.floor(Math.random() * 10000) + 5000,
      withdrawals: Math.floor(Math.random() * 8000) + 3000,
    };
  });

  const transactionTypes = [
    { name: 'Deposits', value: totalDeposits, color: '#10b981' },
    { name: 'Withdrawals', value: totalWithdrawals, color: '#ef4444' },
  ];

  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Deposits',
      value: `$${totalDeposits.toLocaleString()}`,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: TrendingDown,
      label: 'Total Withdrawals',
      value: `$${totalWithdrawals.toLocaleString()}`,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      icon: DollarSign,
      label: 'Net Change',
      value: `$${netChange.toLocaleString()}`,
      color: netChange >= 0 ? 'text-green-600' : 'text-red-600',
      bg: netChange >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      icon: Calendar,
      label: 'Total Transactions',
      value: customerTransactions.length,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Spending Analysis</h1>
        <p className="text-gray-600">Track your financial activity</p>
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
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-2xl text-gray-800">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg text-gray-800 mb-6">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="deposits" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="withdrawals" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg text-gray-800 mb-6">Transaction Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transactionTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {transactionTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-2">
            {transactionTypes.map((type) => (
              <div key={type.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                  <span className="text-sm text-gray-700">{type.name}</span>
                </div>
                <span className="text-sm text-gray-800">${type.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
