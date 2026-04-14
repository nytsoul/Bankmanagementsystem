import apiClient from './apiClient';

export const authService = {
  async login(email: string, password: string) {
    const response = await apiClient.login(email, password);
    return {
      token: response.token,
      user: response.user,
    };
  },

  async register(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    password?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    role?: string;
    adminRegistrationKey?: string;
  }) {
    return await apiClient.register(userData);
  },

  logout() {
    apiClient.clearToken();
  },

  getToken() {
    return apiClient.getToken();
  },

  isAuthenticated() {
    return !!apiClient.getToken();
  },
};

export const accountService = {
  async createAccount(userId: string, accountData: any) {
    return await apiClient.createAccount(userId, accountData);
  },

  async getAccounts() {
    return await apiClient.getAccounts();
  },

  async getAccountsByUser(userId: string) {
    return await apiClient.getAccountsByUser(userId);
  },

  async getAccountByNumber(accountNumber: string) {
    return await apiClient.getAccountByNumber(accountNumber);
  },

  async updateAccount(id: string, data: any) {
    return await apiClient.updateAccount(id, data);
  },

  async deleteAccount(id: string) {
    return await apiClient.deleteAccount(id);
  },
};

export const transactionService = {
  async createTransaction(data: any) {
    return await apiClient.createTransaction(data);
  },

  async getTransactions() {
    return await apiClient.getTransactions();
  },

  async getAccountTransactions(accountId: string) {
    return await apiClient.getAccountTransactions(accountId);
  },

  async getFraudulentTransactions() {
    return await apiClient.getFraudulentTransactions();
  },

  async detectFraud() {
    return await apiClient.detectFraud();
  },
};

export const scheduledTransactionService = {
  async createScheduledTransaction(data: any) {
    return await apiClient.createScheduledTransaction(data);
  },

  async getAllScheduledTransactions() {
    return await apiClient.getAllScheduledTransactions();
  },

  async getScheduledTransactions(accountId: string) {
    return await apiClient.getScheduledTransactionsByAccount(accountId);
  },

  async updateScheduledTransaction(id: string, data: any) {
    return await apiClient.updateScheduledTransaction(id, data);
  },

  async deleteScheduledTransaction(id: string) {
    return await apiClient.deleteScheduledTransaction(id);
  },

  async processScheduledTransactions() {
    return await apiClient.processScheduledTransactions();
  },
};

export const userService = {
  async getUsers() {
    return await apiClient.getUsers();
  },

  async getUser(id: string) {
    return await apiClient.getUser(id);
  },

  async updateUser(id: string, data: any) {
    return await apiClient.updateUser(id, data);
  },

  async deleteUser(id: string) {
    return await apiClient.deleteUser(id);
  },
};
