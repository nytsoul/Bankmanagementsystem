import { useMemo, useState } from 'react';
import { useBank } from '../context/BankContext';
import { ArrowDown, ArrowUp, ArrowLeftRight, Download, Filter, Search } from 'lucide-react';
import { motion } from 'motion/react';

export function AllTransactions() {
  const { customers, accounts, transactions, logAdminActivity } = useBank();
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal' | 'transfer'>('all');
  const [flagFilter, setFlagFilter] = useState<'all' | 'flagged' | 'normal'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const sortedTransactions = useMemo(() => (
    [...transactions].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  ), [transactions]);

  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter((transaction) => {
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesFlag = flagFilter === 'all'
        || (flagFilter === 'flagged' && transaction.isFlagged)
        || (flagFilter === 'normal' && !transaction.isFlagged);

      const account = accounts.find(a => a.id === transaction.accountId);
      const customer = customers.find(c => c.id === account?.customerId);
      const searchValue = `${customer?.name || ''} ${customer?.email || ''} ${account?.accountNumber || ''} ${transaction.description || ''}`
        .toLowerCase();
      const matchesSearch = !searchTerm.trim() || searchValue.includes(searchTerm.toLowerCase());

      const timestamp = new Date(transaction.timestamp);
      const matchesStart = !startDate || timestamp >= new Date(`${startDate}T00:00:00`);
      const matchesEnd = !endDate || timestamp <= new Date(`${endDate}T23:59:59`);

      return matchesType && matchesFlag && matchesSearch && matchesStart && matchesEnd;
    });
  }, [sortedTransactions, filterType, flagFilter, searchTerm, startDate, endDate, accounts, customers]);

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
        <h1 className="text-3xl text-slate-900 mb-2">All Transactions</h1>
        <p className="text-slate-600">Monitor all bank transactions</p>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6 mb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="text-sm text-slate-700">Filter by type:</span>
          </div>
          <button
            onClick={() => {
              if (filteredTransactions.length === 0) return;
              const rows = filteredTransactions.map((transaction) => {
                const account = accounts.find(a => a.id === transaction.accountId);
                const customer = customers.find(c => c.id === account?.customerId);
                return {
                  Date: new Date(transaction.timestamp).toLocaleString(),
                  Customer: customer?.name || '',
                  Account: account?.accountNumber || '',
                  Type: transaction.type,
                  Description: transaction.description || '',
                  Amount: transaction.amount.toFixed(2),
                  Flagged: transaction.isFlagged ? 'Yes' : 'No',
                };
              });
              const headers = Object.keys(rows[0]);
              const csv = [
                headers.join(','),
                ...rows.map(row => headers.map(header => `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`).join(',')),
              ].join('\n');

              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `transactions-${new Date().toISOString().slice(0, 10)}.csv`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              URL.revokeObjectURL(url);

              logAdminActivity({
                action: 'Exported transactions',
                detail: `Exported ${filteredTransactions.length} records`,
                category: 'transaction',
              });
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
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
          {(['all', 'flagged', 'normal'] as const).map((flag) => (
            <motion.button
              key={flag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFlagFilter(flag)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                flagFilter === flag
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              {flag}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search customer, account, or description"
              className="w-full pl-9 pr-3 py-2 bg-white border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full px-3 py-2 bg-white border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full px-3 py-2 bg-white border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-sky-50/70 border-b border-sky-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Date</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Customer</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Account</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Type</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Description</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Amount</th>
              <th className="px-6 py-4 text-left text-sm text-slate-600">Status</th>
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
                  className={`border-b border-sky-50 hover:bg-sky-50/60 transition-colors ${
                    transaction.isFlagged ? 'bg-rose-50/40' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{customer?.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{account?.accountNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm text-slate-700 capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{transaction.description}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${color}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {transaction.isFlagged ? (
                      <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs">
                        Flagged
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
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
