import React, { useState, useEffect } from 'react';
import { accountService } from '@/app/services';

interface AccountsExampleProps {
  userId: string;
}

export const AccountsExample: React.FC<AccountsExampleProps> = ({ userId }) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAccounts();
  }, [userId]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountService.getAccountsByUser(userId);
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Your Accounts</h2>
      {accounts.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.accountNumber}</td>
                <td>{account.accountType}</td>
                <td>${account.balance.toFixed(2)}</td>
                <td>{account.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={loadAccounts}>Refresh</button>
    </div>
  );
};
