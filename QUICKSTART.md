# Quick Start Guide - Bank Management System

## Full Stack Setup

### Frontend + Backend Integration

## 1. Frontend Setup

```bash
# Navigate to project root
cd d:\Programming\Project\Bankmanagement

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```
Frontend will run at: `http://localhost:5173`

## 2. Backend Setup

### Prerequisites
- Java 17+ installed
- MySQL 8.0+ running
- Maven 3.6.0+ installed

### Step-by-step

#### A. Create MySQL Database
Open MySQL CLI and run:
```sql
CREATE DATABASE bank_management;
CREATE USER 'bank_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON bank_management.* TO 'bank_user'@'localhost';
FLUSH PRIVILEGES;
```

#### B. Configure Backend
Edit `Backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bank_management
spring.datasource.username=bank_user
spring.datasource.password=password123
```

#### C. Build & Run
```bash
# Navigate to Backend directory
cd Backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```
Backend will run at: `http://localhost:8080/api`

## 3. Verify Setup

### Frontend
- Open http://localhost:5173
- You should see the login page

### Backend
- Check endpoints: http://localhost:8080/api/auth/login
- Should see CORS-enabled responses

### Database
```bash
mysql -u bank_user -p bank_management
SHOW TABLES;
```

## Project Architecture

```
┌─────────────────────────────────────────┐
│     Frontend (React + TypeScript)        │
│     http://localhost:5173               │
└─────────────────┬───────────────────────┘
                  │ (HTTP/REST)
┌─────────────────▼───────────────────────┐
│    Backend (Spring Boot)                │
│    http://localhost:8080/api            │
└─────────────────┬───────────────────────┘
                  │ (JDBC)
┌─────────────────▼───────────────────────┐
│   MySQL Database                        │
│   bank_management                       │
└─────────────────────────────────────────┘
```

## Key API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Accounts
- `GET /api/accounts/user/{userId}` - Get user's accounts
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/{id}` - Update account

### Transactions
- `GET /api/transactions/account/{accountId}` - Get transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/fraud-checks` - Get suspicious transactions

### Scheduled Transactions
- `POST /api/scheduled-transactions` - Create recurring transaction
- `GET /api/scheduled-transactions/account/{accountId}` - View scheduled

## Testing the API

### Using cURL

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

#### Get User Accounts
```bash
curl http://localhost:8080/api/accounts/user/1
```

## Development Workflow

### Frontend Development
```bash
pnpm run dev
# Hot reload enabled - changes auto-reflect
```

### Backend Development
```bash
mvn spring-boot:run
# DevTools enabled - changes trigger auto-restart
```

### Database Updates
- Tables auto-create/update via Hibernate
- Check `application.properties`:
  - `spring.jpa.hibernate.ddl-auto=update`

## Troubleshooting

### Issue: MySQL Connection Failed
**Solution:**
- Verify MySQL is running: `mysql -u root`
- Check credentials in application.properties
- Create database: `CREATE DATABASE bank_management;`

### Issue: Port 8080 Already In Use
**Solution:**
- Change backend port in application.properties:
  ```properties
  server.port=8081
  ```

### Issue: Frontend Can't Reach Backend
**Solution:**
- Ensure backend is running on port 8080
- CORS is configured for http://localhost:5173
- Check browser console for network errors

### Issue: Build Fails
**Solution:**
```bash
# Clear cache and rebuild
mvn clean
mvn install
```

## Next Steps

1. **Implement Service Methods** - Add business logic to service classes
2. **Add Input Validation** - Validate all API requests
3. **Implement Security** - JWT token validation for protected routes
4. **Add Error Handling** - Global exception handler
5. **Connect Frontend** - Update React components to use real APIs
6. **Add Testing** - Unit and integration tests
7. **API Documentation** - Add Swagger/OpenAPI
8. **Deploy** - Containerize and deploy to production

## File Structure Reference

```
Backend/
├── src/main/java/com/example/backend/
│   ├── controller/          # API Endpoints
│   ├── service/             # Business Logic
│   ├── repository/          # Data Access
│   ├── entity/              # Database Models
│   ├── dto/                 # API Data Transfer
│   ├── config/              # Spring Config
│   ├── security/            # Authentication
│   └── exception/           # Error Handling
├── src/main/resources/
│   ├── application.properties   # Config
│   └── static/              # Static files
├── pom.xml                  # Maven Dependencies
└── BACKEND_README.md        # Full Documentation
```

## Resources

- Frontend: See `README.md`
- Backend: See `Backend/BACKEND_README.md`
- Database Schema: See `Backend/BACKEND_README.md` Database Schema section

---

**Need Help?** Check the respective README files for detailed documentation.
