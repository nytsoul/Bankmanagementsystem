import apiClient from './apiClient';

const currentUserKey = 'currentUser';

const normalizeRole = (role?: string) => (role || '').toLowerCase() === 'admin' ? 'admin' : 'customer';

const storeCurrentUser = (user: any) => {
  if (!user) return;
  const stored = {
    id: user.id,
    username: user.email || user.username || '',
    role: normalizeRole(user.role),
    customerId: user.id,
  };
  localStorage.setItem(currentUserKey, JSON.stringify(stored));
};

const clearCurrentUser = () => {
  localStorage.removeItem(currentUserKey);
};

export const authService = {
  async login(email: string, password: string) {
    const response = await apiClient.login(email, password);
    if (response?.user) {
      storeCurrentUser(response.user);
    }
    return response;
  },

  async register(userData: any) {
    return apiClient.register(userData);
  },

  async logout() {
    apiClient.clearToken();
    clearCurrentUser();
  },

  getSession() {
    const stored = localStorage.getItem(currentUserKey);
    return stored ? JSON.parse(stored) : null;
  },

  getToken() {
    return apiClient.getToken();
  },

  isAuthenticated() {
    return Boolean(apiClient.getToken());
  }
};

export const accountService = {
  async createAccount(userId: string, accountData: any) {
    return apiClient.createAccount(userId, accountData);
  },

  async getAccounts() {
    return apiClient.getAccounts();
  },

  async getAccountsByUser(userId: string) {
    return apiClient.getAccountsByUser(userId);
  },

  async updateAccount(id: string, data: any) {
    return apiClient.updateAccount(id, data);
  },

  async deleteAccount(id: string) {
    return apiClient.deleteAccount(id);
  }
};

export const transactionService = {
  async createTransaction(data: any) {
    return apiClient.createTransaction(data);
  },

  async getTransactions() {
    return apiClient.getTransactions();
  },

  async getAccountTransactions(accountId: string) {
    return apiClient.getAccountTransactions(accountId);
  },

  async getFraudulentTransactions() {
    return apiClient.getFraudulentTransactions();
  },

  async detectFraud() {
    return apiClient.detectFraud();
  }
};

export const scheduledTransactionService = {
  async createScheduledTransaction(data: any) {
    return apiClient.createScheduledTransaction(data);
  },

  async getAllScheduledTransactions() {
    return apiClient.getAllScheduledTransactions();
  },

  async getScheduledTransactionsByAccount(accountId: string) {
    return apiClient.getScheduledTransactionsByAccount(accountId);
  },

  async updateScheduledTransaction(id: string, data: any) {
    return apiClient.updateScheduledTransaction(id, data);
  },

  async deleteScheduledTransaction(id: string) {
    return apiClient.deleteScheduledTransaction(id);
  },

  async processScheduledTransactions() {
    return apiClient.processScheduledTransactions();
  }
};

export const userService = {
  async getUsers() {
    return apiClient.getUsers();
  },

  async getUser(id: string) {
    return apiClient.getUser(id);
  },

  async updateUser(id: string, data: any) {
    return apiClient.updateUser(id, data);
  },

  async deleteUser(id: string) {
    return apiClient.deleteUser(id);
  }
};
