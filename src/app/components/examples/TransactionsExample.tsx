import React, { useState, useEffect } from 'react';
import { transactionService } from '@/app/services';

interface TransactionsExampleProps {
  accountId: string;
}

export const TransactionsExample: React.FC<TransactionsExampleProps> = ({ accountId }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [accountId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAccountTransactions(accountId);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.transactionDate).toLocaleDateString()}</td>
                <td>{tx.transactionType}</td>
                <td>${tx.amount.toFixed(2)}</td>
                <td>{tx.description}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={loadTransactions}>Refresh</button>
    </div>
  );
};
