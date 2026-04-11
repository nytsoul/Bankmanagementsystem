# Bank Management System - Backend Setup Guide

## Overview
This is a Spring Boot 4.0.5 backend for the Bank Management System. It provides REST APIs for managing accounts, transactions, scheduled transactions, and fraud detection.

## Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6.0 or higher

## Technology Stack

| Component | Version |
|-----------|---------|
| Spring Boot | 4.0.5 |
| Java | 17 |
| MySQL | 8.0+ |
| Maven | 3.6.0+ |
| JWT (io.jsonwebtoken) | 0.12.3 |
| Lombok | Latest |

## Setup Instructions

### 1. Database Setup

Create MySQL database and user:
```sql
CREATE DATABASE bank_management;
CREATE USER 'bank_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON bank_management.* TO 'bank_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Configuration

Update `src/main/resources/application.properties`:
```properties
# MySQL Database
spring.datasource.url=jdbc:mysql://localhost:3306/bank_management
spring.datasource.username=bank_user
spring.datasource.password=secure_password

# JWT Secret (Change in production!)
jwt.secret=your-very-long-secret-key-change-this-in-production
jwt.expiration=86400000
```

### 3. Build & Run

```bash
# Navigate to Backend directory
cd Backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the compiled JAR
java -jar target/Backend-0.0.1-SNAPSHOT.jar
```

The API will be available at: `http://localhost:8080/api`

## API Endpoints

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration

### Accounts
- **GET** `/api/accounts/{id}` - Get account by ID
- **GET** `/api/accounts/user/{userId}` - Get all user accounts
- **GET** `/api/accounts/number/{accountNumber}` - Get account by number
- **POST** `/api/accounts` - Create new account
- **PUT** `/api/accounts/{id}` - Update account
- **DELETE** `/api/accounts/{id}` - Delete account

### Transactions
- **GET** `/api/transactions/{id}` - Get transaction details
- **GET** `/api/transactions/account/{accountId}` - Get account transactions
- **GET** `/api/transactions/account/{accountId}/range` - Get transactions by date range
- **POST** `/api/transactions` - Create transaction
- **GET** `/api/transactions/fraud-checks` - Get flagged transactions
- **POST** `/api/transactions/detect-fraud` - Run fraud detection

### Scheduled Transactions
- **GET** `/api/scheduled-transactions/{id}` - Get scheduled transaction
- **GET** `/api/scheduled-transactions/account/{accountId}` - Get account's scheduled transactions
- **POST** `/api/scheduled-transactions` - Create scheduled transaction
- **PUT** `/api/scheduled-transactions/{id}` - Update scheduled transaction
- **DELETE** `/api/scheduled-transactions/{id}` - Delete scheduled transaction
- **POST** `/api/scheduled-transactions/process` - Process scheduled transactions

## Project Structure

```
Backend/src/main/java/com/example/backend/
├── controller/              # REST API Controllers
│   ├── AuthController.java
│   ├── AccountController.java
│   ├── TransactionController.java
│   └── ScheduledTransactionController.java
├── service/                 # Business Logic Services
│   ├── AuthService.java
│   ├── AccountService.java
│   ├── TransactionService.java
│   ├── ScheduledTransactionService.java
│   └── JwtService.java
├── repository/              # Spring Data JPA Repositories
│   ├── UserRepository.java
│   ├── AccountRepository.java
│   ├── TransactionRepository.java
│   └── ScheduledTransactionRepository.java
├── entity/                  # JPA Entity Models
│   ├── User.java
│   ├── Account.java
│   ├── Transaction.java
│   └── ScheduledTransaction.java
├── dto/                     # Data Transfer Objects
│   ├── UserDTO.java
│   ├── AccountDTO.java
│   ├── TransactionDTO.java
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   └── ScheduledTransactionDTO.java
├── config/                  # Spring Configuration
│   └── WebConfig.java
├── security/                # Security Configuration
├── exception/               # Custom Exception Classes
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
└── BackendApplication.java  # Main Application Class
```

## Database Schema

### Users Table
- `id`: Primary Key
- `email`: Unique email
- `password`: Encrypted password
- `first_name`: User's first name
- `last_name`: User's last name
- `phone_number`: Contact number
- `role`: CUSTOMER or ADMIN
- `is_active`: Account status

### Accounts Table
- `id`: Primary Key
- `account_number`: Unique account number
- `user_id`: Foreign Key to Users
- `account_type`: SAVINGS, CHECKING, MONEY_MARKET, CD
- `balance`: Current balance
- `interest_rate`: Interest rate for account
- `created_at`: Account creation date
- `is_active`: Account status

### Transactions Table
- `id`: Primary Key
- `account_id`: Foreign Key to Accounts
- `transaction_type`: DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT, INTEREST
- `amount`: Transaction amount
- `transaction_date`: Date of transaction
- `description`: Transaction details
- `recipient_account`: Recipient account number
- `recipient_name`: Recipient name
- `status`: PENDING, COMPLETED, FAILED, CANCELLED
- `reference_number`: Unique transaction reference
- `is_fraudulent`: Fraud flag
- `fraud_reason`: Reason for fraud flag

### Scheduled Transactions Table
- `id`: Primary Key
- `account_id`: Foreign Key to Accounts
- `description`: Transaction description
- `amount`: Amount to transfer
- `scheduled_date`: Scheduled date
- `next_execution_date`: Next execution date
- `recurrence_type`: ONCE, DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
- `recurrence_interval`: Interval for recurrence
- `status`: ACTIVE, PAUSED, COMPLETED, CANCELLED

## Key Features Implemented

### 1. Authentication
- User login with email/password
- JWT token generation and validation
- Role-based access control (CUSTOMER, ADMIN)

### 2. Account Management
- Create/Read/Update/Delete accounts
- Multiple accounts per user
- Account type support (Savings, Checking, etc.)

### 3. Transaction Processing
- Create transactions (deposit, withdrawal, transfer)
- Transaction history and filtering
- Date range queries
- Transaction status tracking

### 4. Scheduled Transactions
- Create recurring transactions
- Support for various recurrence patterns
- Automatic processing of due transactions
- Pause/Resume/Cancel functionality

### 5. Fraud Detection
- Flag suspicious transactions
- Fraud scoring system
- Admin review interface

## Security Considerations

1. **Password Encryption**: All passwords are stored using bcrypt hashing
2. **JWT Tokens**: Tokens expire after 24 hours
3. **CORS Configuration**: Limited to frontend origins
4. **Input Validation**: All inputs are validated
5. **SQL Injection Prevention**: Using prepared statements via JPA

## Development Tips

### Enable Debug Logging
Update `application.properties`:
```properties
logging.level.com.example.backend=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Hot Reload
Include Spring DevTools for automatic reload on file changes:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"
```

### Database Reset
To reset the database schema:
1. Update `spring.jpa.hibernate.ddl-auto=create` temporarily
2. Run the application
3. Change back to `update`

## Troubleshooting

### Connection Issues
- Verify MySQL is running
- Check credentials in application.properties
- Ensure database exists

### Build Errors
- Clear Maven cache: `mvn clean`
- Rebuild: `mvn install`
- Check Java version: `java -version`

### Port Conflicts
- Change port in application.properties: `server.port=8081`

## Next Steps

1. Implement service layer methods
2. Add authentication interceptors
3. Implement fraud detection algorithms
4. Add comprehensive error handling
5. Create unit and integration tests
6. Add API documentation (Swagger/OpenAPI)

## References

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- JWT with Spring Security: https://jwt.io/
- MySQL Documentation: https://dev.mysql.com/doc/
