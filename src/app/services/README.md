# Frontend API Service Configuration

## Environment Variables

Create a `.env.local` file in the project root with the following:

```env
# Backend API Configuration
VITE_API_URL=http://localhost:8080/api

# Optional: Add more environments
# For development
# VITE_API_URL=http://localhost:8080/api

# For production
# VITE_API_URL=https://api.example.com/api
```

## Usage

The API client is automatically configured to use the `VITE_API_URL` environment variable. If not specified, it defaults to `http://localhost:8080/api`.

### Services Available

1. **authService** - Authentication & Authorization
   - `login(email, password)`
   - `register(userData)`
   - `logout()`
   - `getToken()`
   - `isAuthenticated()`

2. **accountService** - Account Management
   - `createAccount(accountData)`
   - `getAccountsByUser(userId)`
   - `getAccountByNumber(accountNumber)`
   - `updateAccount(id, data)`
   - `deleteAccount(id)`

3. **transactionService** - Transaction Processing
   - `createTransaction(data)`
   - `getAccountTransactions(accountId)`
   - `getFraudulentTransactions()`
   - `detectFraud()`

4. **scheduledTransactionService** - Recurring Transactions
   - `createScheduledTransaction(data)`
   - `getScheduledTransactions(accountId)`
   - `updateScheduledTransaction(id, data)`
   - `deleteScheduledTransaction(id)`
   - `processScheduledTransactions()`

## Authentication

The API client automatically handles JWT token management:
- Tokens are stored in `localStorage`
- Tokens are automatically included in all requests via `Authorization: Bearer <token>` header
- Tokens are cleared on logout
