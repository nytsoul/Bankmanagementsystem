import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Customer, Account, Transaction, ScheduledTransaction } from '../types';
import { mockUsers, mockCustomers, mockAccounts, mockTransactions } from '../data/mockData';

interface BankContextType {
  currentUser: User | null;
  customers: Customer[];
  accounts: Account[];
  transactions: Transaction[];
  scheduledTransactions: ScheduledTransaction[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addAccount: (account: Omit<Account, 'id' | 'accountNumber' | 'createdAt'>) => void;
  closeAccount: (accountId: string) => void;
  freezeAccount: (accountId: string) => void;
  unfreezeAccount: (accountId: string) => void;
  deposit: (accountId: string, amount: number, description: string) => boolean;
  withdraw: (accountId: string, amount: number, description: string) => boolean;
  transfer: (fromAccountId: string, toAccountId: string, amount: number, description: string) => boolean;
  addScheduledTransaction: (scheduledTx: Omit<ScheduledTransaction, 'id'>) => void;
  calculateInterest: (accountId: string) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const storedCustomers = localStorage.getItem('customers');
    setCustomers(storedCustomers ? JSON.parse(storedCustomers) : mockCustomers);

    const storedAccounts = localStorage.getItem('accounts');
    setAccounts(storedAccounts ? JSON.parse(storedAccounts) : mockAccounts);

    const storedTransactions = localStorage.getItem('transactions');
    setTransactions(storedTransactions ? JSON.parse(storedTransactions) : mockTransactions);

    const storedScheduled = localStorage.getItem('scheduledTransactions');
    setScheduledTransactions(storedScheduled ? JSON.parse(storedScheduled) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('scheduledTransactions', JSON.stringify(scheduledTransactions));
  }, [scheduledTransactions]);

  const login = (username: string, password: string): boolean => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `CUST${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    setAccounts(accounts.filter(a => a.customerId !== id));
  };

  const addAccount = (accountData: Omit<Account, 'id' | 'accountNumber' | 'createdAt'>) => {
    const newAccount: Account = {
      ...accountData,
      id: `ACC${Date.now()}`,
      accountNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      createdAt: new Date().toISOString(),
    };
    setAccounts([...accounts, newAccount]);
  };

  const closeAccount = (accountId: string) => {
    setAccounts(accounts.filter(a => a.id !== accountId));
  };

  const freezeAccount = (accountId: string) => {
    setAccounts(accounts.map(a => a.id === accountId ? { ...a, status: 'frozen' } : a));
  };

  const unfreezeAccount = (accountId: string) => {
    setAccounts(accounts.map(a => a.id === accountId ? { ...a, status: 'active' } : a));
  };

  const detectFraud = (accountId: string, amount: number, type: TransactionType): boolean => {
    const recentTransactions = transactions
      .filter(t => t.accountId === accountId)
      .filter(t => {
        const txTime = new Date(t.timestamp).getTime();
        const now = Date.now();
        return now - txTime < 3600000;
      });

    if (amount > 50000) return true;
    if (recentTransactions.length > 5) return true;

    return false;
  };

  const deposit = (accountId: string, amount: number, description: string): boolean => {
    const account = accounts.find(a => a.id === accountId);
    if (!account || account.status === 'frozen') return false;

    const isFlagged = detectFraud(accountId, amount, 'deposit');

    setAccounts(accounts.map(a =>
      a.id === accountId ? { ...a, balance: a.balance + amount } : a
    ));

    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      accountId,
      type: 'deposit',
      amount,
      timestamp: new Date().toISOString(),
      description,
      isFlagged,
    };
    setTransactions([...transactions, newTransaction]);
    return true;
  };

  const withdraw = (accountId: string, amount: number, description: string): boolean => {
    const account = accounts.find(a => a.id === accountId);
    if (!account || account.status === 'frozen' || account.balance < amount) return false;

    const isFlagged = detectFraud(accountId, amount, 'withdrawal');

    setAccounts(accounts.map(a =>
      a.id === accountId ? { ...a, balance: a.balance - amount } : a
    ));

    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      accountId,
      type: 'withdrawal',
      amount,
      timestamp: new Date().toISOString(),
      description,
      isFlagged,
    };
    setTransactions([...transactions, newTransaction]);
    return true;
  };

  const transfer = (fromAccountId: string, toAccountId: string, amount: number, description: string): boolean => {
    const fromAccount = accounts.find(a => a.id === fromAccountId);
    const toAccount = accounts.find(a => a.id === toAccountId);

    if (!fromAccount || !toAccount || fromAccount.status === 'frozen' || fromAccount.balance < amount) {
      return false;
    }

    const isFlagged = detectFraud(fromAccountId, amount, 'transfer');

    setAccounts(accounts.map(a => {
      if (a.id === fromAccountId) return { ...a, balance: a.balance - amount };
      if (a.id === toAccountId) return { ...a, balance: a.balance + amount };
      return a;
    }));

    const transferTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      accountId: fromAccountId,
      type: 'transfer',
      amount,
      toAccountId,
      timestamp: new Date().toISOString(),
      description,
      isFlagged,
    };
    setTransactions([...transactions, transferTransaction]);
    return true;
  };

  const addScheduledTransaction = (scheduledTx: Omit<ScheduledTransaction, 'id'>) => {
    const newScheduled: ScheduledTransaction = {
      ...scheduledTx,
      id: `SCH${Date.now()}`,
    };
    setScheduledTransactions([...scheduledTransactions, newScheduled]);
  };

  const calculateInterest = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account || account.accountType !== 'savings') return;

    const interest = account.balance * (account.interestRate / 100);
    setAccounts(accounts.map(a =>
      a.id === accountId ? { ...a, balance: a.balance + interest } : a
    ));

    const interestTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      accountId,
      type: 'deposit',
      amount: interest,
      timestamp: new Date().toISOString(),
      description: 'Interest credited',
      isFlagged: false,
    };
    setTransactions([...transactions, interestTransaction]);
  };

  return (
    <BankContext.Provider
      value={{
        currentUser,
        customers,
        accounts,
        transactions,
        scheduledTransactions,
        login,
        logout,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addAccount,
        closeAccount,
        freezeAccount,
        unfreezeAccount,
        deposit,
        withdraw,
        transfer,
        addScheduledTransaction,
        calculateInterest,
      }}
    >
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within BankProvider');
  }
  return context;
}
