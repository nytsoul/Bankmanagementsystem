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

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await deposit(accountId, parseFloat(amount), description);
    if (success) {
      toast.success('Deposit successful', { description: `$${amount} deposited to your account` });
      setAmount('');
      setDescription('');
    } else {
      toast.error('Deposit failed', { description: 'Account is frozen or invalid' });
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await withdraw(accountId, parseFloat(amount), description);
    if (success) {
      toast.success('Withdrawal successful', { description: `$${amount} withdrawn from your account` });
      setAmount('');
      setDescription('');
    } else {
      toast.error('Withdrawal failed', { description: 'Insufficient balance or account frozen' });
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await transfer(accountId, toAccountId, parseFloat(amount), description);
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
    { id: 'deposit', label: 'Deposit', icon: ArrowDown, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUp, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight, color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 mb-2">Transactions</h1>
        <p className="text-slate-600">Manage your money</p>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6">
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
                    : 'bg-sky-50 text-slate-600 hover:bg-sky-100'
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
              <label className="block text-sm text-slate-700 mb-2">Select Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              <label className="block text-sm text-slate-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors"
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
              <label className="block text-sm text-slate-700 mb-2">Select Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
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
              <label className="block text-sm text-slate-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Enter description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors"
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
              <label className="block text-sm text-slate-700 mb-2">From Account</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
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
              <label className="block text-sm text-slate-700 mb-2">To Account Number</label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
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
              <label className="block text-sm text-slate-700 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white/70 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-colors"
            >
              Transfer Money
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
