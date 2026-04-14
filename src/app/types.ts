export type UserRole = 'admin' | 'customer';

export type AccountType = 'savings' | 'current';

export type AccountStatus = 'active' | 'frozen';

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  customerId?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: UserRole;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface AdminActivity {
  id: string;
  actor: string;
  action: string;
  detail: string;
  category: 'customer' | 'account' | 'transaction' | 'fraud' | 'role' | 'system';
  timestamp: string;
}

export interface Account {
  id: string;
  customerId: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  status: AccountStatus;
  interestRate: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  toAccountId?: string;
  timestamp: string;
  description: string;
  isFlagged?: boolean;
}

export interface ScheduledTransaction {
  id: string;
  accountId: string;
  toAccountId: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  nextExecutionDate: string;
  isActive: boolean;
  description: string;
}
