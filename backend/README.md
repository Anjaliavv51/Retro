# Retro Backend API Service

Node.js + Express backend service providing Authentication, MongoDB integration, JWT security, and CSRF protection.

---

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017` or a MongoDB Atlas URI)

---

### Configuration
Configuration is managed via `.env`. A default `.env` has been generated:
```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/my_database
SECRET=retro_super_secret_jwt_key_2024
CLIENT_URL=http://localhost:3000
```

---

### How to Run

1. **Install dependencies** (first time):
   ```bash
   cd backend
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```
   Or for live reloading with nodemon:
   ```bash
   npm run dev
   ```

   The backend will be running at: **http://localhost:5000**

---

### Endpoints
- `GET /csrf-token`: Fetch CSRF token for secure form submissions
- `POST /api/auth/signup`: User registration
- `POST /api/auth/signin`: User login (issues JWT token cookie)
- `POST /api/auth/logout`: User logout
- `GET /api/auth/user`: Retrieve authenticated user profile (requires JWT)
