import type { User, Customer, Account, Transaction } from '../types';

export const mockUsers: User[] = [
  {
    id: 'USR001',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'USR002',
    username: 'john.doe',
    password: 'password123',
    role: 'customer',
    customerId: 'CUST001',
  },
  {
    id: 'USR003',
    username: 'jane.smith',
    password: 'password123',
    role: 'customer',
    customerId: 'CUST002',
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 'CUST001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0101',
    address: '123 Main St, New York, NY 10001',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'CUST002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0102',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    createdAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'CUST003',
    name: 'Robert Johnson',
    email: 'robert.j@email.com',
    phone: '+1-555-0103',
    address: '789 Pine Rd, Chicago, IL 60601',
    createdAt: '2024-03-10T09:15:00Z',
  },
];

export const mockAccounts: Account[] = [
  {
    id: 'ACC001',
    customerId: 'CUST001',
    accountNumber: '1234567890',
    accountType: 'savings',
    balance: 15420.50,
    status: 'active',
    interestRate: 4.5,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'ACC002',
    customerId: 'CUST001',
    accountNumber: '1234567891',
    accountType: 'current',
    balance: 8250.75,
    status: 'active',
    interestRate: 0,
    createdAt: '2024-01-20T11:00:00Z',
  },
  {
    id: 'ACC003',
    customerId: 'CUST002',
    accountNumber: '9876543210',
    accountType: 'savings',
    balance: 32100.00,
    status: 'active',
    interestRate: 4.5,
    createdAt: '2024-02-20T15:00:00Z',
  },
  {
    id: 'ACC004',
    customerId: 'CUST003',
    accountNumber: '5555555555',
    accountType: 'current',
    balance: 5680.25,
    status: 'active',
    interestRate: 0,
    createdAt: '2024-03-10T10:00:00Z',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TXN001',
    accountId: 'ACC001',
    type: 'deposit',
    amount: 5000,
    timestamp: '2024-04-01T10:00:00Z',
    description: 'Salary deposit',
    isFlagged: false,
  },
  {
    id: 'TXN002',
    accountId: 'ACC001',
    type: 'withdrawal',
    amount: 1200,
    timestamp: '2024-04-02T14:30:00Z',
    description: 'ATM withdrawal',
    isFlagged: false,
  },
  {
    id: 'TXN003',
    accountId: 'ACC001',
    type: 'transfer',
    amount: 500,
    toAccountId: 'ACC002',
    timestamp: '2024-04-05T09:15:00Z',
    description: 'Transfer to current account',
    isFlagged: false,
  },
  {
    id: 'TXN004',
    accountId: 'ACC003',
    type: 'deposit',
    amount: 10000,
    timestamp: '2024-04-03T11:20:00Z',
    description: 'Business income',
    isFlagged: false,
  },
  {
    id: 'TXN005',
    accountId: 'ACC003',
    type: 'withdrawal',
    amount: 75000,
    timestamp: '2024-04-04T16:45:00Z',
    description: 'Large withdrawal',
    isFlagged: true,
  },
];
