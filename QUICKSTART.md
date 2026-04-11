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
- MongoDB 4.0+ running
- Maven 3.6.0+ installed

### Step-by-step

#### A. Start MongoDB
**Option 1: Local Installation**
```bash
# Windows: Start MongoDB service
# It's usually installed as a Windows service and starts automatically
```

**Option 2: Docker**
```bash
# Pull and run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Verify MongoDB is running:**
```bash
# Test connection
mongosh
```

#### B. Configure Backend
Edit `Backend/src/main/resources/application.properties`:
```properties
# For local MongoDB (no authentication)
spring.data.mongodb.uri=mongodb://localhost:27017/bank_management

# For MongoDB with Docker
spring.data.mongodb.uri=mongodb://localhost:27017/bank_management
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

### MongoDB
```bash
# Open MongoDB shell
mongosh

# Check if database is created
use bank_management
show collections
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
                  │ (Spring Data MongoDB)
┌─────────────────▼───────────────────────┐
│   MongoDB Database                      │
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

### Database Management
#### View MongoDB Collections
```bash
mongosh

# Use the database
use bank_management

# View collections
show collections

# View sample documents
db.users.find()
db.accounts.find()
db.transactions.find()
```

#### Export/Import Data
```bash
# Export collection
mongoexport --db bank_management --collection users --out users.json

# Import collection
mongoimport --db bank_management --collection users --file users.json
```

## Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
- Verify MongoDB is running: `mongosh` or check Windows Services
- Check URI in application.properties
- Ensure port 27017 is not blocked by firewall

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

### Issue: Maven Not Found
**Solution:**
- Ensure Maven is installed: `mvn --version`
- Add Maven to PATH environment variable
- Download from https://maven.apache.org/

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
│   ├── repository/          # Data Access (MongoDB)
│   ├── entity/              # Database Models (@Document)
│   ├── dto/                 # API Data Transfer
│   ├── config/              # Spring Config
│   ├── security/            # Authentication
│   └── exception/           # Error Handling
├── src/main/resources/
│   ├── application.properties   # Config (MongoDB URI)
│   └── static/              # Static files
├── pom.xml                  # Maven Dependencies
└── BACKEND_README.md        # Full Documentation
```

## Resources

- Frontend: See `README.md`
- Backend: See `Backend/BACKEND_README.md`
- MongoDB Collections: See `Backend/BACKEND_README.md` Database Collections section

---

**Need Help?** Check the respective README files for detailed documentation.
