import { useState } from 'react';
import { useBank } from '../context/BankContext';
import { ArrowDown, ArrowUp, ArrowLeftRight, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export function AllTransactions() {
  const { customers, accounts, transactions } = useBank();
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal' | 'transfer'>('all');

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredTransactions = filterType === 'all'
    ? sortedTransactions
    : sortedTransactions.filter(t => t.type === filterType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return ArrowDown;
      case 'withdrawal': return ArrowUp;
      case 'transfer': return ArrowLeftRight;
      default: return ArrowDown;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-600';
      case 'withdrawal': return 'text-red-600';
      case 'transfer': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">All Transactions</h1>
        <p className="text-gray-600">Monitor all bank transactions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">Filter by type:</span>
        </div>
        <div className="flex gap-2">
          {(['all', 'deposit', 'withdrawal', 'transfer'] as const).map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-gray-600">Date</th>
              <th className="px-6 py-4 text-left text-sm text-gray-600">Customer</th>
              <th className="px-6 py-4 text-left text-sm text-gray-600">Account</th>
              <th className="px-6 py-4 text-left text-sm text-gray-600">Type</th>
              <th className="px-6 py-4 text-left text-sm text-gray-600">Description</th>
              <th className="px-6 py-4 text-left text-sm text-gray-600">Amount</th>
              <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => {
              const account = accounts.find(a => a.id === transaction.accountId);
              const customer = customers.find(c => c.id === account?.customerId);
              const Icon = getIcon(transaction.type);
              const color = getColor(transaction.type);

              return (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.5) }}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    transaction.isFlagged ? 'bg-red-50/50' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{customer?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{account?.accountNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm text-gray-700 capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${color}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {transaction.isFlagged ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        Flagged
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        Normal
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
