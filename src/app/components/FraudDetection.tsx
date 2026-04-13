import { useBank } from '../context/BankContext';
import { AlertTriangle, DollarSign, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export function FraudDetection() {
  const { customers, accounts, transactions } = useBank();

  const flaggedTransactions = transactions.filter(t => t.isFlagged);

  const fraudRules = [
    { icon: DollarSign, label: 'High-value transactions', description: 'Transactions over $50,000', color: 'text-rose-600', bg: 'bg-rose-50' },
    { icon: Activity, label: 'Frequent transactions', description: 'More than 5 transactions per hour', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: AlertTriangle, label: 'Unusual patterns', description: 'Detected suspicious activity', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

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
              <p className="text-sm text-slate-600">{rule.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl text-slate-900">Flagged Transactions</h2>
          <span className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg text-sm">
            {flaggedTransactions.length} Alerts
          </span>
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

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-rose-50 border border-rose-200 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-rose-100 rounded-lg mt-1">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-900 mb-1">{customer?.name}</p>
                        <p className="text-xs text-slate-600 mb-2">{transaction.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
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
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
