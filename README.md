# Tanky – Fuel Management System

## Setup

### 1. Install backend dependencies
```bash
npm install
```

### 2. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 3. Create the database
Open pgAdmin → Create database named: tanky_db

### 4. Configure .env
Edit the .env file with your PostgreSQL password.

### 5. Build the frontend
```bash
cd client
npm run build
cd ..
```

### 6. Run the server
```bash
npm run start:dev
```

Open http://localhost:3500

### 7. Create your first admin user (run once)
```bash
curl -X POST http://localhost:3500/api/users -H "Content-Type: application/json" -d "{\"full_name\": \"Super Admin\", \"phone\": \"01000000000\", \"password\": \"admin123\", \"role\": \"platform_admin\"}"
```

Login at http://localhost:3500 with phone: 01000000000 / password: admin123
