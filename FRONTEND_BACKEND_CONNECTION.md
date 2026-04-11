# Frontend-Backend Connection Guide

## ✅ Connection Status

The Bank Management System frontend and backend are now **fully connected**!

## 🔧 Setup Instructions

### Step 1: Ensure Backend is Running

```bash
cd Backend
.\mvnw spring-boot:run
```

Backend runs at: `http://localhost:8080/api`

### Step 2: Configure Frontend API URL

The frontend is configured to connect to the backend via environment variables.

**File:** `.env.local`
```env
VITE_API_URL=http://localhost:8080/api
```

This file is already created with the correct URL!

### Step 3: Start Frontend

```bash
pnpm install  # If not already done
pnpm run dev
```

Frontend runs at: `http://localhost:5173`

## 📋 What's Connected

### API Services Created

1. **apiClient.ts** - Core HTTP client with fetch API
   - Automatic JWT token management
   - Request/response handling
   - Error handling with logging

2. **index.ts (Services)** - Service layer organized by feature
   - `authService` - Login, Register, Logout
   - `accountService` - Account operations
   - `transactionService` - Transaction handling
   - `scheduledTransactionService` - Recurring transactions

3. **Environment Configuration**
   - `.env.local` - Local development configuration
   - `.env.example` - Example template
   - Auto-loaded by Vite's `import.meta.env`

## 🔗 API Endpoints Available

### Authentication
```
POST /api/auth/login
POST /api/auth/register
```

### Accounts
```
POST /api/accounts
GET /api/accounts/user/{userId}
GET /api/accounts/number/{accountNumber}
PUT /api/accounts/{id}
DELETE /api/accounts/{id}
```

### Transactions
```
POST /api/transactions
GET /api/transactions/account/{accountId}
GET /api/transactions/fraud-checks
POST /api/transactions/detect-fraud
```

### Scheduled Transactions
```
POST /api/scheduled-transactions
GET /api/scheduled-transactions/account/{accountId}
PUT /api/scheduled-transactions/{id}
DELETE /api/scheduled-transactions/{id}
POST /api/scheduled-transactions/process
```

## 💻 Using the API in Components

### Example: Using Auth Service

```typescript
import { authService } from '@/app/services';

// Login
const response = await authService.login('user@example.com', 'password');
console.log(response.user, response.token);

// Check authentication
if (authService.isAuthenticated()) {
  // User is logged in
}

// Logout
authService.logout();
```

### Example: Using Account Service

```typescript
import { accountService } from '@/app/services';

// Get user accounts
const accounts = await accountService.getAccountsByUser(userId);

// Create new account
const newAccount = await accountService.createAccount({
  accountNumber: '1234567890',
  accountType: 'SAVINGS',
  balance: 1000,
  interestRate: 0.05,
});
```

### Example: Using Transaction Service

```typescript
import { transactionService } from '@/app/services';

// Create transaction
const transaction = await transactionService.createTransaction({
  accountId: 'account123',
  transactionType: 'DEPOSIT',
  amount: 500,
  description: 'Monthly deposit',
});

// Get transactions
const transactions = await transactionService.getAccountTransactions(accountId);

// Check for fraud
const fraudTransactions = await transactionService.getFraudulentTransactions();
```

## 🔐 Token Management

Tokens are automatically managed:
- **Stored in:** `localStorage` under key `authToken`
- **Sent in:** All requests via `Authorization: Bearer <token>` header
- **Cleared on:** Logout via `authService.logout()`

## 🚀 Testing the Connection

### Using Browser Console

```javascript
// Import from window (after app loads)
// Then test endpoints:

// 1. Login
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com', 
    password: 'password' 
  })
})

// 2. Get accounts (with token)
const token = localStorage.getItem('authToken');
fetch('http://localhost:8080/api/accounts/user/user123', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### Using cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get accounts
curl http://localhost:8080/api/accounts/user/user123 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ⚙️ Configuration Changes for Different Environments

### Development
```env
VITE_API_URL=http://localhost:8080/api
```

### Staging
```env
VITE_API_URL=https://staging-api.example.com/api
```

### Production
```env
VITE_API_URL=https://api.example.com/api
```

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution:**
- Ensure backend CORS is configured for `http://localhost:5173`
- Backend already has CORS enabled in `WebConfig.java`
- Check browser console for specific CORS error

### Issue: 404 Not Found
**Solution:**
- Verify backend API URL in `.env.local`
- Check if backend service implementation exists
- Verify endpoint path matches controller mapping

### Issue: 401 Unauthorized
**Solution:**
- Ensure token is set after login: `authService.login()`
- Check if token is properly stored in localStorage
- Token might be expired - re-login required

### Issue: Network Error
**Solution:**
- Verify backend is running: `.\mvnw spring-boot:run`
- Check backend port: should be 8080
- Check firewall/network connectivity

## 📦 Next Steps

1. **Update Components** - Replace mock data with API calls
   - `Login.tsx` - Use `authService.login()`
   - `CustomerDashboard.tsx` - Load real accounts/transactions
   - `AccountManagement.tsx` - Use `accountService` methods

2. **Add Error Handling** - Implement try-catch in all API calls
   - Display error messages to users
   - Log errors for debugging

3. **Add Loading States** - Show loading indicators during API calls
   - Use state management for loading/error states
   - Provide user feedback

4. **Add Data Validation** - Validate responses from backend
   - Type-check API responses
   - Handle unexpected data format

5. **Implement Interceptors** - For common operations
   - Auto-refresh tokens
   - Log all API calls
   - Handle global errors

## ✅ Integration Checklist

- [x] Backend API created and running
- [x] Frontend API client created
- [x] Environment variables configured
- [x] CORS enabled on backend
- [x] Authentication service implemented
- [x] Account service implemented
- [x] Transaction service implemented
- [x] Scheduled transaction service implemented
- [ ] Components updated to use real API
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] User feedback messages added

---

**Status:** Frontend and Backend are fully connected and ready for integration! 🎉
