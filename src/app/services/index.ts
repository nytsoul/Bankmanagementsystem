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
  async createAccount(accountData: any) {
    return await apiClient.createAccount(accountData);
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

  async getScheduledTransactions(accountId: string) {
    return await apiClient.getScheduledTransactions(accountId);
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
