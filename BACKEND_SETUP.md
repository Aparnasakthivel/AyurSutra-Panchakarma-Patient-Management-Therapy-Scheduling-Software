# Backend Setup & Execution Guide

## 🎯 Complete Setup Instructions

### Step 1: Prerequisites Installation

#### On Windows:
1. **Install Node.js** from https://nodejs.org/ (LTS version recommended)
2. **Install MongoDB Community Edition** from https://www.mongodb.com/try/download/community
   - During installation, choose to install MongoDB Compass (GUI tool)
3. **Start MongoDB Service:**
   - Open Services app → Find "MongoDB Server" → Right-click → Start

OR use **MongoDB Atlas** (Cloud):
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account
   - Create a cluster
   - Get connection string (looks like: `mongodb+srv://user:password@cluster.mongodb.net/dbname`)

#### On macOS:
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### On Linux (Ubuntu):
```bash
# Install Node.js
sudo apt update
sudo apt install nodejs npm

# Install MongoDB
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

---

### Step 2: Project Setup

1. **Navigate to project directory:**
   ```bash
   cd d:\UIT\mini_project\apt
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install all required packages from `package.json`

3. **Verify MongoDB is running:**
   - Windows: Check MongoDB Compass connects to `localhost:27017`
   - Mac/Linux: Run `mongosh` in terminal to verify connection

---

### Step 3: Environment Configuration

Edit `.env` file in the root directory:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/panchakarma
NODE_ENV=development
```

**For MongoDB Atlas, use:**
```env
PORT=4000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster-name.mongodb.net/panchakarma?retryWrites=true&w=majority
NODE_ENV=development
```

---

### Step 4: Initialize Database with Sample Data

```bash
node backend/scripts/initializeDB.js
```

Expected output:
```
✓ Connected to MongoDB
🗑️  Clearing existing data...
✓ Data cleared
👥 Creating sample patients...
✓ 3 patients created
🏥 Creating sample doctors...
✓ 2 doctors created
📦 Creating sample stock items...
✓ 3 stock items created
✓ Admin user created
✓ Database initialized successfully!
```

---

### Step 5: Run the Backend Server

#### Development Mode (Auto-reload on file changes):
```bash
npm run server:dev
```

#### Production Mode:
```bash
npm run server
```

**Expected output:**
```
Connecting to MongoDB: mongodb://localhost:27017/panchakarma
✓ MongoDB connected
✓ Server running on http://localhost:4000
✓ API Documentation:
  - Patients: GET/POST http://localhost:4000/api/patients
  - Doctors: GET/POST http://localhost:4000/api/doctors
  - Therapies: GET/POST http://localhost:4000/api/therapies
  - Stock: GET/POST http://localhost:4000/api/stock
  - Reports: GET/POST http://localhost:4000/api/reports
  - Billing: GET/POST http://localhost:4000/api/billing
  - Admins: GET/POST http://localhost:4000/api/admins
  - Reminders: POST http://localhost:4000/api/reminders
  - Health Check: GET http://localhost:4000/api/health
```

---

## 🧪 Testing the Backend

### Option 1: Using cURL (Command Line)

```bash
# Test health check
curl http://localhost:4000/api/health

# Get all patients
curl http://localhost:4000/api/patients

# Create a patient
curl -X POST http://localhost:4000/api/patients \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Patient\",
    \"email\": \"test@example.com\",
    \"phone\": \"1234567890\",
    \"age\": 30,
    \"gender\": \"Male\",
    \"address\": \"Test Address\"
  }"
```

### Option 2: Using Postman (Desktop App)

1. **Download Postman** from https://www.postman.com/downloads/
2. **Import the provided Postman collection:**
   - Open Postman → Click "Import"
   - Select the collection file (if available)
   - Or manually create requests using the URLs below

3. **Create requests in Postman:**
   - **GET /api/patients** → Click Send
   - **POST /api/patients** → Add JSON body → Click Send

### Option 3: Using MongoDB Compass (Visual Database)

1. **Open MongoDB Compass**
2. **Connect to:** `localhost:27017`
3. **Browse database:** panchakarma
4. **View collections:** patients, doctors, therapies, stock, billing, reports, admins

### Option 4: Using VS Code REST Client Extension

1. **Install Extension:** "REST Client" by Huachao Zheng
2. **Create `requests.http` file:**

```http
### Get Health Status
GET http://localhost:4000/api/health

### Get All Patients
GET http://localhost:4000/api/patients

### Get Single Patient
GET http://localhost:4000/api/patients/PASTE_PATIENT_ID_HERE

### Create Patient
POST http://localhost:4000/api/patients
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "age": 45,
  "gender": "Male",
  "address": "123 Main St"
}

### Update Patient
PUT http://localhost:4000/api/patients/PASTE_PATIENT_ID_HERE
Content-Type: application/json

{
  "status": "Inactive"
}

### Delete Patient
DELETE http://localhost:4000/api/patients/PASTE_PATIENT_ID_HERE
```

3. **Click "Send Request"** above each request to test

---

## 🔍 Common Commands

```bash
# Install new package
npm install package-name

# Check if server is running
curl http://localhost:4000/api/health

# View MongoDB databases
mongosh
> show dbs
> use panchakarma
> show collections

# Clear database and reinitialize
node backend/scripts/initializeDB.js

# Stop the server
Ctrl + C
```

---

## 🚀 Full Execution Workflow

### Complete Setup from Scratch:

```bash
# 1. Navigate to project
cd d:\UIT\mini_project\apt

# 2. Install dependencies
npm install

# 3. Start MongoDB (if local)
# - Windows: Start MongoDB Service
# - Mac: brew services start mongodb-community
# - Linux: sudo systemctl start mongodb

# 4. Initialize database
node backend/scripts/initializeDB.js

# 5. Start development server
npm run server:dev

# 6. Test API in browser or Postman
# Visit: http://localhost:4000/api/health
# Or: http://localhost:4000/api/patients
```

---

## 📊 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check with details |
| GET | `/api/patients` | Get all patients |
| POST | `/api/patients` | Create patient |
| PUT | `/api/patients/:id` | Update patient |
| DELETE | `/api/patients/:id` | Delete patient |
| GET | `/api/doctors` | Get all doctors |
| POST | `/api/doctors` | Create doctor |
| GET | `/api/therapies` | Get all therapies (with populations) |
| POST | `/api/therapies` | Create therapy |
| GET | `/api/stock` | Get all stock items |
| POST | `/api/stock` | Create stock item |
| GET | `/api/stock/low-stock/alert` | Get low stock items |
| GET | `/api/billing` | Get all billing records |
| POST | `/api/billing` | Create billing |
| GET | `/api/billing/pending/list` | Get pending payments |
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Create report |
| GET | `/api/admins` | Get all admins |
| POST | `/api/admins` | Create admin |
| POST | `/api/reminders` | Send reminder |

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to MongoDB"
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solutions:**
- Ensure MongoDB service is running
- Check MONGODB_URI in .env file
- Verify port 27017 is not blocked

### Issue: "Address already in use"
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solutions:**
```bash
# Windows: Change PORT in .env to 4001, or kill process
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux: 
lsof -i :4000
kill -9 <PID>
```

### Issue: "Module not found"
```
Error: Cannot find module 'mongoose'
```
**Solutions:**
```bash
npm install
npm install mongoose dotenv
```

### Issue: "CORS error"
Check that server has CORS enabled (it should by default)

### Issue: Validation errors on POST
Ensure all required fields are provided and correct format. Check error message in response for details.

---

## 📈 Next Steps

1. **Test all endpoints** using Postman or REST Client
2. **Verify database** using MongoDB Compass
3. **Connect frontend** - Update `package.json` scripts to run both frontend and backend
4. **Add authentication** - Implement JWT for secure endpoints
5. **Add email/SMS** - Integrate Nodemailer or Twilio for reminders

---

## ✅ Checklist Before Going Live

- [ ] MongoDB connection working
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Sample data initialized
- [ ] All API endpoints tested
- [ ] Error handling working
- [ ] CORS properly configured
- [ ] Passwords hashed (bcrypt)
- [ ] Authentication implemented
- [ ] Logging configured

---

For more information, see:
- Backend API Documentation: `backend/README.md`
- Mongoose Docs: https://mongoosejs.com
- Express.js Docs: https://expressjs.com
- MongoDB Docs: https://docs.mongodb.com
