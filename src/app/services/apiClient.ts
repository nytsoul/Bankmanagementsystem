// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const options: RequestInit = {
        method,
        headers: this.getHeaders(),
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return {} as T;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<any>('POST', '/auth/login', {
      email,
      password,
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }) {
    return this.request<any>('POST', '/auth/register', userData);
  }

  // Account endpoints
  async createAccount(accountData: {
    accountNumber: string;
    accountType: string;
    balance: number;
    interestRate: number;
  }) {
    return this.request<any>('POST', '/accounts', accountData);
  }

  async getAccountsByUser(userId: string) {
    return this.request<any>('GET', `/accounts/user/${userId}`);
  }

  async getAccountByNumber(accountNumber: string) {
    return this.request<any>('GET', `/accounts/number/${accountNumber}`);
  }

  async updateAccount(
    id: string,
    accountData: {
      accountNumber?: string;
      accountType?: string;
      balance?: number;
      interestRate?: number;
    }
  ) {
    return this.request<any>('PUT', `/accounts/${id}`, accountData);
  }

  async deleteAccount(id: string) {
    return this.request<any>('DELETE', `/accounts/${id}`);
  }

  // Transaction endpoints
  async createTransaction(transactionData: {
    accountId: string;
    transactionType: string;
    amount: number;
    description: string;
    recipientAccount?: string;
    recipientName?: string;
  }) {
    return this.request<any>('POST', '/transactions', transactionData);
  }

  async getAccountTransactions(accountId: string) {
    return this.request<any>('GET', `/transactions/account/${accountId}`);
  }

  async getFraudulentTransactions() {
    return this.request<any>('GET', '/transactions/fraud-checks');
  }

  async detectFraud() {
    return this.request<any>('POST', '/transactions/detect-fraud');
  }

  // Scheduled Transaction endpoints
  async createScheduledTransaction(scheduledData: {
    accountId: string;
    description: string;
    amount: number;
    scheduledDate: string;
    recurrenceType: string;
    recipientAccount?: string;
    recipientName?: string;
  }) {
    return this.request<any>('POST', '/scheduled-transactions', scheduledData);
  }

  async getScheduledTransactions(accountId: string) {
    return this.request<any>('GET', `/scheduled-transactions/account/${accountId}`);
  }

  async updateScheduledTransaction(
    id: string,
    data: any
  ) {
    return this.request<any>('PUT', `/scheduled-transactions/${id}`, data);
  }

  async deleteScheduledTransaction(id: string) {
    return this.request<any>('DELETE', `/scheduled-transactions/${id}`);
  }

  async processScheduledTransactions() {
    return this.request<any>('POST', '/scheduled-transactions/process');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
