import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Customer, Account, Transaction, ScheduledTransaction } from '../types';
import {
  authService,
  accountService,
  transactionService,
  scheduledTransactionService,
  userService,
} from '../services';

interface BankContextType {
  currentUser: User | null;
  customers: Customer[];
  accounts: Account[];
  transactions: Transaction[];
  scheduledTransactions: ScheduledTransaction[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<boolean>;
  logout: () => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'> & { password: string }) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addAccount: (account: Omit<Account, 'id' | 'accountNumber' | 'createdAt'>) => Promise<void>;
  closeAccount: (accountId: string) => Promise<void>;
  freezeAccount: (accountId: string) => Promise<void>;
  unfreezeAccount: (accountId: string) => Promise<void>;
  deposit: (accountId: string, amount: number, description: string) => Promise<boolean>;
  withdraw: (accountId: string, amount: number, description: string) => Promise<boolean>;
  transfer: (fromAccountId: string, toAccountId: string, amount: number, description: string) => Promise<boolean>;
  addScheduledTransaction: (scheduledTx: Omit<ScheduledTransaction, 'id'>) => Promise<void>;
  calculateInterest: (accountId: string) => Promise<void>;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([]);

  const mapRole = (role?: string): User['role'] => {
    return role?.toLowerCase() === 'admin' ? 'admin' : 'customer';
  };

  const mapAccountType = (accountType?: string): Account['accountType'] => {
    const normalized = accountType?.toUpperCase();
    return normalized === 'SAVINGS' ? 'savings' : 'current';
  };

  const mapTransactionType = (transactionType?: string): Transaction['type'] => {
    const normalized = transactionType?.toUpperCase();
    if (normalized === 'WITHDRAWAL') return 'withdrawal';
    if (normalized === 'TRANSFER') return 'transfer';
    return 'deposit';
  };

  const mapFrequency = (recurrenceType?: string): ScheduledTransaction['frequency'] => {
    const normalized = recurrenceType?.toUpperCase();
    if (normalized === 'DAILY') return 'daily';
    if (normalized === 'WEEKLY') return 'weekly';
    return 'monthly';
  };

  const toRecurrenceType = (frequency: ScheduledTransaction['frequency']) => {
    if (frequency === 'daily') return 'DAILY';
    if (frequency === 'weekly') return 'WEEKLY';
    return 'MONTHLY';
  };

  const mapUserToCustomer = (user: any): Customer => ({
    id: user.id,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
    email: user.email || '',
    phone: user.phoneNumber || '',
    address: user.address || '',
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
  });

  const mapAccountDtoToAccount = (account: any): Account => ({
    id: account.id,
    customerId: account.userId,
    accountNumber: account.accountNumber,
    accountType: mapAccountType(account.accountType),
    balance: Number(account.balance || 0),
    status: account.isActive === false ? 'frozen' : 'active',
    interestRate: Number(account.interestRate || 0),
    createdAt: account.createdAt ? new Date(account.createdAt).toISOString() : new Date().toISOString(),
  });

  const mapTransactionDtoToTransaction = (transaction: any): Transaction => ({
    id: transaction.id,
    accountId: transaction.accountId,
    type: mapTransactionType(transaction.transactionType),
    amount: Number(transaction.amount || 0),
    timestamp: transaction.transactionDate
      ? new Date(transaction.transactionDate).toISOString()
      : new Date().toISOString(),
    description: transaction.description || '',
    isFlagged: Boolean(transaction.isFraudulent),
  });

  const mapScheduledDtoToScheduled = (
    scheduled: any,
    availableAccounts: Account[]
  ): ScheduledTransaction => {
    const toAccount = availableAccounts.find(acc => acc.accountNumber === scheduled.recipientAccount);
    return {
      id: scheduled.id,
      accountId: scheduled.accountId,
      toAccountId: toAccount?.id || '',
      amount: Number(scheduled.amount || 0),
      frequency: mapFrequency(scheduled.recurrenceType),
      nextExecutionDate: scheduled.nextExecutionDate
        ? new Date(scheduled.nextExecutionDate).toISOString()
        : new Date(scheduled.scheduledDate || Date.now()).toISOString(),
      isActive: String(scheduled.status || '').toUpperCase() === 'ACTIVE',
      description: scheduled.description || '',
    };
  };

  const loadAllData = async () => {
    try {
      const [usersResponse, accountsResponse, transactionsResponse, scheduledResponse] = await Promise.all([
        userService.getUsers(),
        accountService.getAccounts(),
        transactionService.getTransactions(),
        scheduledTransactionService.getAllScheduledTransactions(),
      ]);

      const mappedAccounts = (accountsResponse || []).map(mapAccountDtoToAccount);
      const mappedCustomers = (usersResponse || [])
        .filter((user: any) => mapRole(user.role) === 'customer')
        .map(mapUserToCustomer);

      setCustomers(mappedCustomers);
      setAccounts(mappedAccounts);
      setTransactions((transactionsResponse || []).map(mapTransactionDtoToTransaction));
      setScheduledTransactions(
        (scheduledResponse || []).map((scheduled: any) => mapScheduledDtoToScheduled(scheduled, mappedAccounts))
      );
    } catch (error) {
      setCustomers([]);
      setAccounts([]);
      setTransactions([]);
      setScheduledTransactions([]);
    }
  };

  const loadFromStorage = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  };

  useEffect(() => {
    loadFromStorage();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    loadAllData();
  }, [currentUser?.id]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);
      if (!response?.user) return false;

      const user: User = {
        id: response.user.id,
        username: response.user.email,
        password: '',
        role: mapRole(response.user.role),
        customerId: response.user.id,
      };

      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber?: string;
  }): Promise<boolean> => {
    try {
      await authService.register(payload);
      return await login(payload.email, payload.password);
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCustomers([]);
    setAccounts([]);
    setTransactions([]);
    setScheduledTransactions([]);
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'> & { password: string }) => {
    const nameParts = customerData.name.trim().split(' ');
    const [firstName, ...lastParts] = nameParts;
    const lastName = lastParts.join(' ');

    const response = await authService.register({
      email: customerData.email,
      firstName: firstName || customerData.name,
      lastName: lastName || '',
      phoneNumber: customerData.phone,
      password: customerData.password,
      address: customerData.address,
    });

    if (response) {
      setCustomers([...customers, mapUserToCustomer(response)]);
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const nameParts = updates.name ? updates.name.trim().split(' ') : [];
    const [firstName, ...lastParts] = nameParts;
    const lastName = lastParts.join(' ');

    const response = await userService.updateUser(id, {
      email: updates.email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phoneNumber: updates.phone,
      address: updates.address,
    });

    if (response) {
      setCustomers(customers.map(c => c.id === id ? mapUserToCustomer(response) : c));
    }
  };

  const deleteCustomer = async (id: string) => {
    await userService.deleteUser(id);
    setCustomers(customers.filter(c => c.id !== id));
    setAccounts(accounts.filter(a => a.customerId !== id));
  };

  const addAccount = async (accountData: Omit<Account, 'id' | 'accountNumber' | 'createdAt'>) => {
    const payload = {
      accountType: accountData.accountType === 'savings' ? 'SAVINGS' : 'CHECKING',
      balance: accountData.balance,
      interestRate: accountData.interestRate,
      isActive: accountData.status === 'active',
    };

    const response = await accountService.createAccount(accountData.customerId, payload);
    if (response) {
      setAccounts([...accounts, mapAccountDtoToAccount(response)]);
    }
  };

  const closeAccount = async (accountId: string) => {
    await accountService.deleteAccount(accountId);
    setAccounts(accounts.filter(a => a.id !== accountId));
  };

  const freezeAccount = async (accountId: string) => {
    const response = await accountService.updateAccount(accountId, { isActive: false });
    if (response) {
      setAccounts(accounts.map(a => a.id === accountId ? mapAccountDtoToAccount(response) : a));
    }
  };

  const unfreezeAccount = async (accountId: string) => {
    const response = await accountService.updateAccount(accountId, { isActive: true });
    if (response) {
      setAccounts(accounts.map(a => a.id === accountId ? mapAccountDtoToAccount(response) : a));
    }
  };

  const refreshAccountsAndTransactions = async () => {
    const [accountsResponse, transactionsResponse] = await Promise.all([
      accountService.getAccounts(),
      transactionService.getTransactions(),
    ]);

    const mappedAccounts = (accountsResponse || []).map(mapAccountDtoToAccount);
    setAccounts(mappedAccounts);
    setTransactions((transactionsResponse || []).map(mapTransactionDtoToTransaction));
  };

  const deposit = async (accountId: string, amount: number, description: string): Promise<boolean> => {
    try {
      await transactionService.createTransaction({
        accountId,
        transactionType: 'DEPOSIT',
        amount,
        description,
      });
      await refreshAccountsAndTransactions();
      return true;
    } catch (error) {
      return false;
    }
  };

  const withdraw = async (accountId: string, amount: number, description: string): Promise<boolean> => {
    try {
      await transactionService.createTransaction({
        accountId,
        transactionType: 'WITHDRAWAL',
        amount,
        description,
      });
      await refreshAccountsAndTransactions();
      return true;
    } catch (error) {
      return false;
    }
  };

  const transfer = async (fromAccountId: string, toAccountId: string, amount: number, description: string): Promise<boolean> => {
    const toAccount = accounts.find(a => a.id === toAccountId);
    if (!toAccount) return false;

    try {
      await transactionService.createTransaction({
        accountId: fromAccountId,
        transactionType: 'TRANSFER',
        amount,
        description,
        recipientAccount: toAccount.accountNumber,
      });
      await refreshAccountsAndTransactions();
      return true;
    } catch (error) {
      return false;
    }
  };

  const addScheduledTransaction = async (scheduledTx: Omit<ScheduledTransaction, 'id'>) => {
    const toAccount = accounts.find(a => a.id === scheduledTx.toAccountId);
    const scheduledDate = scheduledTx.nextExecutionDate || new Date().toISOString();

    const response = await scheduledTransactionService.createScheduledTransaction({
      accountId: scheduledTx.accountId,
      description: scheduledTx.description,
      amount: scheduledTx.amount,
      scheduledDate,
      recurrenceType: toRecurrenceType(scheduledTx.frequency),
      recipientAccount: toAccount?.accountNumber,
    });

    if (response) {
      setScheduledTransactions([
        ...scheduledTransactions,
        mapScheduledDtoToScheduled(response, accounts),
      ]);
    }
  };

  const calculateInterest = async (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account || account.accountType !== 'savings') return;

    const interest = account.balance * (account.interestRate / 100);
    if (interest <= 0) return;

    try {
      await transactionService.createTransaction({
        accountId,
        transactionType: 'INTEREST',
        amount: interest,
        description: 'Interest credited',
      });

      await refreshAccountsAndTransactions();
    } catch (error) {
      return;
    }
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
        register,
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
