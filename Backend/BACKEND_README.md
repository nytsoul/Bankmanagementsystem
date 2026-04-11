# Bank Management System - Backend Setup Guide

## Overview
This is a Spring Boot 4.0.5 backend for the Bank Management System. It provides REST APIs for managing accounts, transactions, scheduled transactions, and fraud detection. The backend uses **MongoDB** as the NoSQL database.

## Prerequisites
- Java 17 or higher
- MongoDB 4.0 or higher
- Maven 3.6.0 or higher

## Technology Stack

| Component | Version |
|-----------|---------|
| Spring Boot | 4.0.5 |
| Java | 17 |
| MongoDB | 4.0+ |
| Maven | 3.6.0+ |
| Spring Data MongoDB | Latest |
| JWT (io.jsonwebtoken) | 0.12.3 |
| Lombok | Latest |

## Setup Instructions

### 1. Database Setup

#### Install MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will be installed as a service and start automatically

**Verify MongoDB is running:**
```bash
# Open MongoDB shell
mongosh

# Create database and collections (optional - auto-created by Spring)
use bank_management
```

#### Alternative: Docker Setup
```bash
# Pull and run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# With authentication:
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  --name mongodb mongo:latest
```

### 2. Backend Configuration

Update `src/main/resources/application.properties`:

**For local MongoDB (no authentication):**
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/bank_management
spring.data.mongodb.auto-index-creation=true
```

**For MongoDB with authentication:**
```properties
spring.data.mongodb.uri=mongodb://username:password@localhost:27017/bank_management?authSource=admin
spring.data.mongodb.auto-index-creation=true
```

**Or use individual properties:**
```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=bank_management
spring.data.mongodb.username=admin
spring.data.mongodb.password=password
spring.data.mongodb.authentication-database=admin
spring.data.mongodb.auto-index-creation=true
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
├── repository/              # Spring Data MongoDB Repositories
│   ├── UserRepository.java
│   ├── AccountRepository.java
│   ├── TransactionRepository.java
│   └── ScheduledTransactionRepository.java
├── entity/                  # MongoDB Document Models
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

## Database Collections

### Users Collection
Documents store:
- `_id`: MongoDB ObjectId (converted to String)
- `email`: Unique email
- `password`: Encrypted password
- `firstName`: User's first name
- `lastName`: User's last name
- `phoneNumber`: Contact number
- `role`: CUSTOMER or ADMIN
- `address`, `city`, `state`, `zipCode`: Address fields
- `isActive`: Account status (true/false)
- `accountIds`: Array of account IDs (references)

**Index:**
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "phoneNumber": 1 }, { unique: true, sparse: true })
```

### Accounts Collection
Documents store:
- `_id`: MongoDB ObjectId
- `accountNumber`: Unique account number
- `userId`: Reference to user (String)
- `accountType`: SAVINGS, CHECKING, MONEY_MARKET, CD
- `balance`: BigDecimal current balance
- `interestRate`: Interest rate
- `createdAt`: Account creation timestamp
- `lastModified`: Last update timestamp
- `isActive`: Status (true/false)
- `transactionIds`: Array of transaction IDs
- `scheduledTransactionIds`: Array of scheduled transaction IDs

**Index:**
```javascript
db.accounts.createIndex({ "accountNumber": 1 }, { unique: true })
db.accounts.createIndex({ "userId": 1 })
```

### Transactions Collection
Documents store:
- `_id`: MongoDB ObjectId
- `accountId`: Reference to account
- `transactionType`: DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT, INTEREST
- `amount`: BigDecimal transaction amount
- `transactionDate`: Timestamp
- `description`: Transaction details
- `recipientAccount`: Recipient account number
- `recipientName`: Recipient name
- `status`: PENDING, COMPLETED, FAILED, CANCELLED
- `referenceNumber`: Unique reference
- `isFraudulent`: Boolean fraud flag
- `fraudReason`: Fraud reason (if flagged)

**Index:**
```javascript
db.transactions.createIndex({ "accountId": 1 })
db.transactions.createIndex({ "transactionDate": -1 })
db.transactions.createIndex({ "isFraudulent": 1 })
```

### Scheduled Transactions Collection
Documents store:
- `_id`: MongoDB ObjectId
- `accountId`: Reference to account
- `description`: Transaction description
- `amount`: BigDecimal amount
- `scheduledDate`: Scheduled date
- `nextExecutionDate`: Next run date
- `recurrenceType`: ONCE, DAILY, WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY, YEARLY
- `recurrenceInterval`: Interval count
- `status`: ACTIVE, PAUSED, COMPLETED, CANCELLED
- `recipientAccount`: Recipient account
- `recipientName`: Recipient name
- `createdAt`: Creation timestamp
- `lastModified`: Last update timestamp

**Index:**
```javascript
db.scheduled_transactions.createIndex({ "accountId": 1 })
db.scheduled_transactions.createIndex({ "status": 1 })
db.scheduled_transactions.createIndex({ "nextExecutionDate": 1 })
```

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
5. **NoSQL Injection Prevention**: Using Spring Data MongoDB with parameterized queries

## Development Tips

### Enable Debug Logging
Update `application.properties`:
```properties
logging.level.com.example.backend=DEBUG
logging.level.org.springframework.data.mongodb=DEBUG
```

### Hot Reload
Include Spring DevTools for automatic reload on file changes:
```bash
mvn spring-boot:run
```

### View MongoDB Data
Use MongoDB Compass or mongosh CLI:
```bash
# Open mongosh
mongosh

# Connect to database
use bank_management

# View collections
show collections

# View sample documents
db.users.find()
db.accounts.find()
db.transactions.find()
```

### Export/Import Data
```bash
# Export collection
mongoexport --db bank_management --collection users --out users.json

# Import collection
mongoimport --db bank_management --collection users --file users.json
```

## Troubleshooting

### Connection Issues
- Verify MongoDB is running: `mongosh --version` and check MongoDB service
- Check URI in application.properties
- Ensure database name is correct
- Verify authentication credentials if applicable

### Build Errors
- Clear Maven cache: `mvn clean`
- Rebuild: `mvn install`
- Check Java version: `java -version`

### Port Conflicts
- Change port in application.properties: `server.port=8081`

### MongoDB Connection Timeout
- Check MongoDB is listening on port 27017
- Firewall may be blocking connections
- Try local development first

## Next Steps

1. Implement service layer methods
2. Add authentication interceptors
3. Implement fraud detection algorithms
4. Add comprehensive error handling
5. Create unit and integration tests
6. Add API documentation (Swagger/OpenAPI)
7. Implement data aggregation pipelines for analytics

## References

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- Spring Data MongoDB: https://spring.io/projects/spring-data-mongodb
- MongoDB Documentation: https://docs.mongodb.com/
- JWT with Spring Security: https://jwt.io/
- MongoDB Compass: https://www.mongodb.com/products/compass
