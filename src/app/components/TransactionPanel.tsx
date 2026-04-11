import { useState } from 'react';
import { useBank } from '../context/BankContext';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, ArrowLeftRight } from 'lucide-react';
import { motion } from 'motion/react';

export function TransactionPanel() {
  const { currentUser, accounts, deposit, withdraw, transfer } = useBank();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [accountId, setAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [toAccountId, setToAccountId] = useState('');

  const customerAccounts = accounts.filter(a => a.customerId === currentUser?.customerId);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = deposit(accountId, parseFloat(amount), description);
    if (success) {
      toast.success('Deposit successful', { description: `$${amount} deposited to your account` });
      setAmount('');
      setDescription('');
    } else {
      toast.error('Deposit failed', { description: 'Account is frozen or invalid' });
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const success = withdraw(accountId, parseFloat(amount), description);
    if (success) {
      toast.success('Withdrawal successful', { description: `$${amount} withdrawn from your account` });
      setAmount('');
      setDescription('');
    } else {
      toast.error('Withdrawal failed', { description: 'Insufficient balance or account frozen' });
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const success = transfer(accountId, toAccountId, parseFloat(amount), description);
    if (success) {
      toast.success('Transfer successful', { description: `$${amount} transferred` });
      setAmount('');
      setDescription('');
      setToAccountId('');
    } else {
      toast.error('Transfer failed', { description: 'Insufficient balance or invalid account' });
    }
  };

  const tabs = [
    { id: 'deposit', label: 'Deposit', icon: ArrowDown, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUp, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 mb-2">Transactions</h1>
        <p className="text-gray-600">Manage your money</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? `${tab.bg} ${tab.color}`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {activeTab === 'deposit' && (
          <motion.form
            key="deposit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleDeposit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-700 mb-2">Select Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Choose an account</option>
                {customerAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} - {acc.accountType} (${acc.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Deposit Money
            </button>
          </motion.form>
        )}

        {activeTab === 'withdraw' && (
          <motion.form
            key="withdraw"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleWithdraw}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-700 mb-2">Select Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Choose an account</option>
                {customerAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} - {acc.accountType} (${acc.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Withdraw Money
            </button>
          </motion.form>
        )}

        {activeTab === 'transfer' && (
          <motion.form
            key="transfer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleTransfer}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-700 mb-2">From Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose an account</option>
                {customerAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} - {acc.accountType} (${acc.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">To Account Number</label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose destination account</option>
                {accounts
                  .filter(acc => acc.id !== accountId)
                  .map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountNumber}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Transfer Money
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
