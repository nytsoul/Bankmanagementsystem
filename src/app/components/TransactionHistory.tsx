import { useState } from 'react';
import { useBank } from '../context/BankContext';
import { ArrowDown, ArrowUp, ArrowLeftRight, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export function TransactionHistory() {
  const { currentUser, accounts, transactions } = useBank();
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal' | 'transfer'>('all');

  const customerAccounts = accounts.filter(a => a.customerId === currentUser?.customerId);
  const customerTransactions = transactions
    .filter(t => customerAccounts.some(acc => acc.id === t.accountId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredTransactions = filterType === 'all'
    ? customerTransactions
    : customerTransactions.filter(t => t.type === filterType);

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
        <h1 className="text-3xl text-gray-800 mb-2">Transaction History</h1>
        <p className="text-gray-600">View all your transactions</p>
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

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => {
            const account = customerAccounts.find(a => a.id === transaction.accountId);
            const Icon = getIcon(transaction.type);
            const color = getColor(transaction.type);

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow ${
                  transaction.isFlagged ? 'border-red-300 bg-red-50/30' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      transaction.type === 'deposit' ? 'bg-green-50' :
                      transaction.type === 'withdrawal' ? 'bg-red-50' :
                      'bg-blue-50'
                    }`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{transaction.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-gray-500">A/C: {account?.accountNumber}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                        {transaction.isFlagged && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                            Flagged
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg ${color}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
