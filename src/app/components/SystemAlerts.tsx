import { useMemo } from 'react';
import { useBank } from '../context/BankContext';
import { AlertTriangle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function SystemAlerts() {
  const { accounts, transactions, customers } = useBank();

  const alerts = useMemo(() => {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    const transactionsByAccount = new Map<string, typeof transactions>();
    transactions.forEach((transaction) => {
      const list = transactionsByAccount.get(transaction.accountId) || [];
      list.push(transaction);
      transactionsByAccount.set(transaction.accountId, list);
    });

    const lowBalanceAlerts = accounts
      .filter(account => account.balance < 100)
      .map(account => {
        const customer = customers.find(c => c.id === account.customerId);
        return {
          id: `low-${account.id}`,
          title: 'Low balance alert',
          severity: 'warning' as const,
          detail: `${customer?.name || account.customerId} - ${account.accountNumber} balance $${account.balance.toFixed(2)}`,
          icon: DollarSign,
        };
      });

    const dormantAlerts = accounts
      .filter(account => {
        const lastTransaction = (transactionsByAccount.get(account.id) || [])
          .map(transaction => new Date(transaction.timestamp).getTime())
          .sort((a, b) => b - a)[0];
        return !lastTransaction || now - lastTransaction > thirtyDays;
      })
      .map(account => {
        const customer = customers.find(c => c.id === account.customerId);
        return {
          id: `dormant-${account.id}`,
          title: 'Dormant account',
          severity: 'neutral' as const,
          detail: `${customer?.name || account.customerId} - ${account.accountNumber} has no activity in 30+ days`,
          icon: Clock,
        };
      });

    const spikeAlerts = accounts
      .map(account => {
        const recentCount = (transactionsByAccount.get(account.id) || [])
          .filter(transaction => now - new Date(transaction.timestamp).getTime() <= oneHour)
          .length;
        return { account, recentCount };
      })
      .filter(entry => entry.recentCount > 5)
      .map(entry => {
        const customer = customers.find(c => c.id === entry.account.customerId);
        return {
          id: `spike-${entry.account.id}`,
          title: 'Suspicious activity spike',
          severity: 'critical' as const,
          detail: `${customer?.name || entry.account.customerId} - ${entry.account.accountNumber} has ${entry.recentCount} transactions in the last hour`,
          icon: TrendingUp,
        };
      });

    const highValueAlerts = transactions
      .filter(transaction => transaction.amount >= 50000)
      .map(transaction => {
        const account = accounts.find(a => a.id === transaction.accountId);
        const customer = customers.find(c => c.id === account?.customerId);
        return {
          id: `high-${transaction.id}`,
          title: 'High-value transaction',
          severity: 'critical' as const,
          detail: `${customer?.name || account?.customerId || 'Unknown'} - ${account?.accountNumber || transaction.accountId} $${transaction.amount.toLocaleString()}`,
          icon: AlertTriangle,
        };
      });

    return [...spikeAlerts, ...highValueAlerts, ...lowBalanceAlerts, ...dormantAlerts];
  }, [accounts, transactions, customers]);

  const summary = useMemo(() => {
    return alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<'critical' | 'warning' | 'neutral', number>);
  }, [alerts]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 mb-2">System Alerts</h1>
        <p className="text-slate-600">Monitor low balances, spikes, and dormant accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/90 rounded-xl border border-rose-100 p-4">
          <p className="text-sm text-slate-600">Critical alerts</p>
          <p className="text-2xl text-rose-600 mt-1">{summary.critical || 0}</p>
        </div>
        <div className="bg-white/90 rounded-xl border border-amber-100 p-4">
          <p className="text-sm text-slate-600">Warnings</p>
          <p className="text-2xl text-amber-600 mt-1">{summary.warning || 0}</p>
        </div>
        <div className="bg-white/90 rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Neutral</p>
          <p className="text-2xl text-slate-700 mt-1">{summary.neutral || 0}</p>
        </div>
      </div>

      <div className="bg-white/90 rounded-xl border border-sky-100 p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No system alerts detected.</div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              const severityStyles = alert.severity === 'critical'
                ? 'border-rose-200 bg-rose-50'
                : alert.severity === 'warning'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-slate-200 bg-slate-50';

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  className={`p-4 rounded-lg border ${severityStyles} flex items-start gap-3`}
                >
                  <div className="mt-1">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{alert.detail}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
