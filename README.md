
# Bank Management System

A modern, full-featured bank management application built with React, TypeScript, and Tailwind CSS. The system provides comprehensive banking features including account management, transaction tracking, fraud detection, and spending analysis.

## Overview

This application provides a complete banking solution with role-based dashboards for customers and administrators. Features include real-time account management, transaction history tracking, scheduled transactions, and AI-powered fraud detection.

## Features

### Customer Features
- **Dashboard**: Overview of accounts, recent transactions, and spending analysis
- **Account Management**: View and manage multiple bank accounts
- **Transaction History**: View detailed transaction records with filtering
- **Scheduled Transactions**: Set up and manage recurring or future transactions
- **Spending Analysis**: Visual charts and insights on spending patterns
- **Transaction Panel**: Quick access to transaction details

### Admin Features
- **Admin Dashboard**: System-wide analytics and monitoring
- **Customer Management**: View and manage customer accounts
- **All Transactions**: Monitor all system transactions
- **Fraud Detection**: AI-powered fraud detection and alerts

### General Features
- **Authentication**: Secure login system with role-based access
- **Protected Routes**: Restricted access based on user roles
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and shadcn components

## Tech Stack

- **Frontend**: React 18+, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Component Library**: shadcn/ui

## Project Structure

```
src/
├── main.tsx                 # Application entry point
├── app/
│   ├── App.tsx             # Main app component
│   ├── types.ts            # TypeScript type definitions
│   ├── components/         # React components
│   │   ├── AccountManagement.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AllTransactions.tsx
│   │   ├── CustomerDashboard.tsx
│   │   ├── CustomerManagement.tsx
│   │   ├── FraudDetection.tsx
│   │   ├── Layout.tsx
│   │   ├── Login.tsx
│   │   ├── MyAccounts.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ScheduledTransactions.tsx
│   │   ├── SpendingAnalysis.tsx
│   │   ├── TransactionHistory.tsx
│   │   └── TransactionPanel.tsx
│   ├── context/            # React Context for state management
│   │   └── BankContext.tsx
│   └── data/               # Mock data
│       └── mockData.ts
└── styles/                 # CSS stylesheets
    ├── fonts.css
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Bankmanagement
```

2. Install dependencies:
```bash
pnpm install
```

## Running the Application

### Development Server
```bash
pnpm run dev
```
The application will be available at `http://localhost:5173` (or the next available port).

### Build for Production
```bash
pnpm run build
```

### Preview Production Build
```bash
pnpm run preview
```

## Backend Setup (Spring Boot)

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6.0 or higher

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE bank_management;
```

2. Update database credentials in `Backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bank_management
spring.datasource.username=root
spring.datasource.password=your_password
```

### Backend Installation & Running

1. Navigate to Backend folder:
```bash
cd Backend
```

2. Install dependencies and build:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```
The backend API will be available at `http://localhost:8080/api`

### Backend Project Structure

```
Backend/
├── src/main/java/com/example/backend/
│   ├── controller/           # REST API Controllers
│   │   ├── AuthController.java
│   │   ├── AccountController.java
│   │   ├── TransactionController.java
│   │   └── ScheduledTransactionController.java
│   ├── service/              # Business Logic Services
│   │   ├── AuthService.java
│   │   ├── AccountService.java
│   │   ├── TransactionService.java
│   │   ├── ScheduledTransactionService.java
│   │   └── JwtService.java
│   ├── repository/           # Data Access Layer
│   │   ├── UserRepository.java
│   │   ├── AccountRepository.java
│   │   ├── TransactionRepository.java
│   │   └── ScheduledTransactionRepository.java
│   ├── entity/               # JPA Entity Classes
│   │   ├── User.java
│   │   ├── Account.java
│   │   ├── Transaction.java
│   │   └── ScheduledTransaction.java
│   ├── dto/                  # Data Transfer Objects
│   │   ├── UserDTO.java
│   │   ├── AccountDTO.java
│   │   ├── TransactionDTO.java
│   │   ├── LoginRequest.java
│   │   └── LoginResponse.java
│   ├── config/               # Configuration Classes
│   ├── security/             # Security & JWT Configuration
│   ├── exception/            # Custom Exceptions
│   └── BackendApplication.java
└── pom.xml                   # Maven Configuration
```

### Backend API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Accounts
- `GET /api/accounts/{id}` - Get account details
- `GET /api/accounts/user/{userId}` - Get user's accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account

#### Transactions
- `GET /api/transactions/{id}` - Get transaction details
- `GET /api/transactions/account/{accountId}` - Get account transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/fraud-checks` - Get fraudulent transactions
- `POST /api/transactions/detect-fraud` - Run fraud detection

#### Scheduled Transactions
- `GET /api/scheduled-transactions/{id}` - Get scheduled transaction
- `GET /api/scheduled-transactions/account/{accountId}` - Get account's scheduled transactions
- `POST /api/scheduled-transactions` - Create scheduled transaction
- `PUT /api/scheduled-transactions/{id}` - Update scheduled transaction
- `DELETE /api/scheduled-transactions/{id}` - Delete scheduled transaction
- `POST /api/scheduled-transactions/process` - Process due scheduled transactions

## Component Overview

| Component | Purpose |
|-----------|---------|
| `Login.tsx` | User authentication |
| `ProtectedRoute.tsx` | Route protection based on roles |
| `Layout.tsx` | Main layout wrapper |
| `CustomerDashboard.tsx` | Customer home page |
| `AdminDashboard.tsx` | Admin home page |
| `AccountManagement.tsx` | Account operations |
| `TransactionHistory.tsx` | Transaction records |
| `ScheduledTransactions.tsx` | Recurring/future transactions |
| `SpendingAnalysis.tsx` | Spending charts and insights |
| `FraudDetection.tsx` | Fraud alerts and monitoring |
| `CustomerManagement.tsx` | Admin customer management |
| `AllTransactions.tsx` | Admin transaction overview |

## Context & State Management

The `BankContext.tsx` provides global state management for:
- Authentication state
- User data
- Accounts information
- Transactions
- UI state

## Customization

### Theming
Modify theme settings in:
- `src/styles/theme.css`
- `default_shadcn_theme.css`

### Mock Data
Update test data in `src/app/data/mockData.ts`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is referenced from the original Figma design and is provided as-is.

## Support

For issues or questions, please refer to the Figma design document or create an issue in the repository.
  