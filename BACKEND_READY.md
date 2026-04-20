# ✅ Complete Backend Setup - READY TO USE

Your Panchakarma Therapy Management System now has a **fully configured MongoDB-backed Express.js backend**!

## 📦 What Has Been Created

### ✓ Database Models (7 complete Mongoose schemas)
- **Patient** - Manage patient information
- **Doctor** - Doctor profiles and availability
- **Therapy** - Treatment sessions with doctor/patient references
- **Stock** - Inventory management with low-stock alerts
- **Billing** - Invoice and payment tracking
- **Report** - Medical assessments and findings
- **Admin** - User management with roles

### ✓ API Routes (Complete CRUD operations)
- `/api/patients` - Patient CRUD + individual retrieval
- `/api/doctors` - Doctor management
- `/api/therapies` - Therapy scheduling (with population of related data)
- `/api/stock` - Stock tracking + low-stock alerts
- `/api/billing` - Payment management + pending payments list
- `/api/reports` - Medical report generation
- `/api/admins` - Admin user management
- `/api/reminders` - Appointment reminders

### ✓ Configuration Files
- `.env` - Environment variables
- `backend/config/db.js` - MongoDB connection
- `package.json` - Updated with MongoDB dependencies

### ✓ Documentation
- `BACKEND_SETUP.md` - Complete setup instructions
- `backend/README.md` - API documentation with examples
- `API_QUICK_REFERENCE.md` - Copy-paste examples for all endpoints
- `Panchakarma-API.postman_collection.json` - Ready-to-import Postman collection

### ✓ Sample Data
- `backend/scripts/initializeDB.js` - Initialize DB with sample data

### ✓ Quick Start Scripts
- `setup-backend.ps1` - Windows setup script
- `setup-backend.sh` - Mac/Linux setup script

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start MongoDB
**Windows:**
- Open Services app → Find "MongoDB Server" → Right-click → Start

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongodb
```

**OR Use MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env` file: `MONGODB_URI=mongodb+srv://...`

### Step 3: Run Backend
```bash
# Development mode (auto-reload on changes)
npm run server:dev

# OR Production mode
npm run server
```

**Expected Output:**
```
Connecting to MongoDB: mongodb://localhost:27017/panchakarma
✓ MongoDB connected
✓ Server running on http://localhost:4000
✓ Health Check: GET http://localhost:4000/api/health
```

---

## 🧪 Test the API (Pick One Method)

### Method 1: Browser (Simplest)
```
Visit: http://localhost:4000/api/patients
```

### Method 2: VS Code (REST Client)
1. Install "REST Client" extension
2. Create file: `test.http`
3. Add:
```http
GET http://localhost:4000/api/patients
```
4. Click "Send Request"

### Method 3: Terminal (cURL)
```bash
curl http://localhost:4000/api/patients
```

### Method 4: Postman
1. Download Postman from https://www.postman.com/downloads/
2. Open Postman
3. Click "Import" → Select `Panchakarma-API.postman_collection.json`
4. Test all endpoints

---

## ✨ Key Features

✅ **MongoDB Integration**
- Full Mongoose setup with schemas
- Automatic timestamps
- Data validation

✅ **Complete CRUD Operations**
- GET all + GET by ID
- POST (create)
- PUT (update) 
- DELETE

✅ **Relationships**
- Therapies linked to Patients & Doctors
- Reports linked to Patients & Doctors
- Billing linked to Patients & Therapies

✅ **Special Endpoints**
- Low stock alerts: `/api/stock/low-stock/alert`
- Pending payments: `/api/billing/pending/list`
- Health check: `/api/health`

✅ **Error Handling**
- Proper HTTP status codes
- Descriptive error messages
- Request logging

✅ **CORS Enabled**
- Ready for React frontend integration

---

## 📂 Project Structure

```
d:\UIT\mini_project\apt\
├── backend/
│   ├── config/
│   │   └── db.js                      ← MongoDB connection
│   ├── models/
│   │   ├── Patient.js                 ← Patient schema
│   │   ├── Doctor.js                  ← Doctor schema
│   │   ├── Therapy.js                 ← Therapy schema
│   │   ├── Stock.js                   ← Stock schema
│   │   ├── Billing.js                 ← Billing schema
│   │   ├── Report.js                  ← Report schema
│   │   └── Admin.js                   ← Admin schema
│   ├── routes/
│   │   ├── patients.js                ← Patient endpoints
│   │   ├── doctors.js                 ← Doctor endpoints
│   │   ├── therapies.js               ← Therapy endpoints
│   │   ├── stock.js                   ← Stock endpoints
│   │   ├── billing.js                 ← Billing endpoints
│   │   ├── reports.js                 ← Report endpoints
│   │   ├── admins.js                  ← Admin endpoints
│   │   └── reminders.js               ← Reminder endpoints
│   ├── scripts/
│   │   └── initializeDB.js            ← Sample data script
│   ├── server.js                      ← Main Express server
│   ├── data/                          ← Legacy JSON (optional)
│   └── README.md                      ← Full API documentation
├── src/                               ← React frontend
├── public/                            ← Static files
├── .env                               ← Configuration
├── package.json                       ← Dependencies
├── BACKEND_SETUP.md                   ← Setup instructions
├── API_QUICK_REFERENCE.md             ← Copy-paste examples
└── Panchakarma-API.postman_collection.json ← Postman import
```

---

## 🎯 Common Tasks

### Initialize Database with Sample Data
```bash
node backend/scripts/initializeDB.js
```
Creates 3 sample patients, 2 doctors, 3 stock items, and 1 admin

### View MongoDB Data (GUI)
```bash
# Install MongoDB Compass if not already done
# Open MongoDB Compass → Connect to localhost:27017
# Browse: panchakarma > patients/doctors/therapies/etc.
```

### View MongoDB Data (CLI)
```bash
mongosh
> use panchakarma
> db.patients.find()
> db.patients.countDocuments()
```

### Reset Database
```bash
# Re-run initialization (clears existing data first)
node backend/scripts/initializeDB.js
```

---

## 🔍 Testing Examples

### Get All Patients
```bash
curl http://localhost:4000/api/patients
```

### Create a Patient
```bash
curl -X POST http://localhost:4000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "age": 45,
    "gender": "Male",
    "address": "123 Street"
  }'
```

### Get Health Status
```bash
curl http://localhost:4000/api/health
```

**More examples** → See `API_QUICK_REFERENCE.md`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `BACKEND_SETUP.md` | Complete setup & troubleshooting guide |
| `backend/README.md` | Full API documentation with all endpoints |
| `API_QUICK_REFERENCE.md` | Copy-paste examples for every endpoint |
| `Panchakarma-API.postman_collection.json` | Import to Postman for testing |

---

## 🛠️ Customization

### Add New Endpoint
1. Create a new route in `backend/routes/newroute.js`
2. Import in `backend/server.js`: `const newRoute = require('./routes/newroute');`
3. Register route: `app.use('/api/newroute', newRoute);`

### Modify Model Schema
1. Edit the schema file in `backend/models/`
2. Restart server
3. Re-initialize database if needed

### Change MongoDB URI
Edit `.env`:
```env
MONGODB_URI=your-new-uri
```

---

## 🔐 Security Reminders

Before deploying to production:

- [ ] Hash passwords with bcrypt (not plain text)
- [ ] Add JWT authentication
- [ ] Implement input validation
- [ ] Use HTTPS
- [ ] Enable authentication on MongoDB
- [ ] Implement rate limiting
- [ ] Add request size limits
- [ ] Use environment variables for secrets

---

## 📞 Helpful Links

- **Node.js**: https://nodejs.org/
- **Express.js**: https://expressjs.com/
- **MongoDB**: https://www.mongodb.com/
- **Mongoose**: https://mongoosejs.com/
- **Postman**: https://www.postman.com/
- **MongoDB Compass**: https://www.mongodb.com/products/compass

---

## ✅ Verified & Ready

This backend is:
- ✅ Fully configured with MongoDB
- ✅ All models created with validation
- ✅ All CRUD routes implemented
- ✅ Error handling in place
- ✅ Sample data initialization ready
- ✅ Documentation complete
- ✅ Ready for frontend integration
- ✅ Ready for testing

---

## 🎓 Next Steps

1. **Test the API** using one of the 4 methods above
2. **Explore the documentation** files
3. **Run sample data initialization** for testing
4. **Import Postman collection** for visual testing
5. **Connect the React frontend** when ready
6. **Implement authentication** when deploying
7. **Add more endpoints** as needed

---

## 💬 Quick Help

**Backend not connecting to MongoDB:**
```bash
# Check if MongoDB is running
mongosh

# Or check the error in console
npm run server:dev
```

**Port 4000 already in use:**
```bash
# Change PORT in .env to 4001 or 4002
# Or kill the process using port 4000
# Windows: netstat -ano | findstr :4000
# Mac/Linux: lsof -i :4000
```

**Need to reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run server:dev
```

---

## 📋 API Endpoints Summary

| Resource | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| Patients | ✅ | ✅ | ✅ | ✅ |
| Doctors | ✅ | ✅ | ✅ | ✅ |
| Therapies | ✅ | ✅ | ✅ | ✅ |
| Stock | ✅ | ✅ | ✅ | ✅ |
| Billing | ✅ | ✅ | ✅ | ✅ |
| Reports | ✅ | ✅ | ✅ | ✅ |
| Admins | ✅ | ✅ | ✅ | ✅ |
| Reminders | - | ✅ | - | - |
| Health | ✅ | - | - | - |

---

## 🎉 You're All Set!

Your backend is ready to use. Start with:
```bash
npm run server:dev
```

Then visit: `http://localhost:4000/api/health`

Enjoy building! 🚀
