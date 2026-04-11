import { useBank } from '../context/BankContext';
import { CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function MyAccounts() {
  const { currentUser, accounts, calculateInterest } = useBank();

  const customerAccounts = accounts.filter(a => a.customerId === currentUser?.customerId);

  const handleCalculateInterest = (accountId: string) => {
    calculateInterest(accountId);
    toast.success('Interest calculated and credited', { description: 'Interest has been added to your account' });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">My Accounts</h1>
        <p className="text-gray-600">View and manage your accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customerAccounts.map((account, index) => (
          <motion.div
            key={account.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm opacity-90 mb-1 capitalize">{account.accountType} Account</p>
                <p className="text-xs opacity-75">A/C {account.accountNumber}</p>
              </div>
              <CreditCard className="w-8 h-8 opacity-80" />
            </div>

            <div className="mb-6">
              <p className="text-sm opacity-90 mb-2">Available Balance</p>
              <p className="text-4xl">
                ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div>
                <p className="text-xs opacity-75 mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  account.status === 'active'
                    ? 'bg-green-400/30 text-white'
                    : 'bg-red-400/30 text-white'
                }`}>
                  {account.status}
                </span>
              </div>
              {account.accountType === 'savings' && (
                <div className="text-right">
                  <p className="text-xs opacity-75 mb-2">Interest Rate: {account.interestRate}%</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCalculateInterest(account.id)}
                    disabled={account.status === 'frozen'}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Calculate Interest
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {customerAccounts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No accounts found</p>
        </div>
      )}
    </div>
  );
}
