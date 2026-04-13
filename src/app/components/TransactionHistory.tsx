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
      case 'deposit': return 'text-emerald-600';
      case 'withdrawal': return 'text-rose-600';
      case 'transfer': return 'text-sky-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 mb-2">Transaction History</h1>
        <p className="text-slate-600">View all your transactions</p>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <span className="text-sm text-slate-700">Filter by type:</span>
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
                  ? 'bg-teal-600 text-white'
                  : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
              }`}
            >
              {type}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="bg-white/90 rounded-xl border border-sky-100 p-12 text-center">
            <p className="text-slate-500">No transactions found</p>
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
                className={`bg-white/90 rounded-xl border border-sky-100 p-4 hover:shadow-md transition-shadow ${
                  transaction.isFlagged ? 'border-rose-300 bg-rose-50/30' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      transaction.type === 'deposit' ? 'bg-emerald-50' :
                      transaction.type === 'withdrawal' ? 'bg-rose-50' :
                      'bg-sky-50'
                    }`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900">{transaction.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-slate-500">A/C: {account?.accountNumber}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                        {transaction.isFlagged && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-xs">
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
                    <p className="text-xs text-slate-500 capitalize">{transaction.type}</p>
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
