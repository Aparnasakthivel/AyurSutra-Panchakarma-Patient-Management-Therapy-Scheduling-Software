# Panchakarma Therapy Management Backend

A complete Node.js/Express backend with MongoDB integration for the Ayurvedic Panchakarma Therapy Management System.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local or Cloud - MongoDB Atlas)
- **npm** or **yarn**

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

#### Option A: Local MongoDB
Make sure MongoDB is running locally on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` file:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/panchakarma
```

### 3. Environment Setup

Edit `.env` file:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/panchakarma
NODE_ENV=development
```

### 4. Run the Backend

**Development (with auto-reload):**
```bash
npm run server:dev
```

**Production:**
```bash
npm run server
```

Server will start on `http://localhost:4000`

---

## 📚 API Endpoints

### Base URL
```
http://localhost:4000/api
```

### 1. **Patients Management**
```
GET    /patients           - Get all patients
POST   /patients           - Create new patient
GET    /patients/:id       - Get patient by ID
PUT    /patients/:id       - Update patient
DELETE /patients/:id       - Delete patient
```

**Sample Request (POST):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "age": 45,
  "gender": "Male",
  "address": "123 Street, City",
  "medicalHistory": "Hypertension",
  "allergies": "Penicillin",
  "status": "Active"
}
```

### 2. **Doctors Management**
```
GET    /doctors           - Get all doctors
POST   /doctors           - Create new doctor
GET    /doctors/:id       - Get doctor by ID
PUT    /doctors/:id       - Update doctor
DELETE /doctors/:id       - Delete doctor
```

**Sample Request (POST):**
```json
{
  "name": "Dr. Ayurveda",
  "email": "doctor@example.com",
  "phone": "9876543210",
  "specialization": "Panchakarma Therapy",
  "qualifications": "B.A.M.S, M.D. Ayurveda",
  "licenseNumber": "AY12345678",
  "yearsOfExperience": 15,
  "consultationFee": 500,
  "availability": "Available"
}
```

### 3. **Therapies Management**
```
GET    /therapies         - Get all therapies (with patient & doctor details)
POST   /therapies         - Create new therapy
GET    /therapies/:id     - Get therapy by ID
PUT    /therapies/:id     - Update therapy
DELETE /therapies/:id     - Delete therapy
```

**Sample Request (POST):**
```json
{
  "name": "Abhyanga Massage",
  "description": "Oil massage therapy",
  "duration": 60,
  "cost": 1500,
  "patientId": "PATIENT_MONGODB_ID",
  "doctorId": "DOCTOR_MONGODB_ID",
  "startDate": "2026-02-10T10:00:00Z",
  "endDate": "2026-02-20T10:00:00Z",
  "status": "Scheduled",
  "notes": "Full body massage with herbal oil"
}
```

### 4. **Stock Management**
```
GET    /stock              - Get all stock items
POST   /stock              - Create new stock item
GET    /stock/:id          - Get stock by ID
PUT    /stock/:id          - Update stock
DELETE /stock/:id          - Delete stock
GET    /stock/low-stock/alert - Get items below minimum stock
```

**Sample Request (POST):**
```json
{
  "itemName": "Sesame Oil",
  "category": "Oils",
  "quantity": 50,
  "unit": "Liters",
  "unitCost": 200,
  "supplier": "Ayurveda Supplies Inc",
  "expiryDate": "2026-12-31",
  "minimumStock": 10
}
```

### 5. **Billing Management**
```
GET    /billing                - Get all billing records
POST   /billing                - Create new billing
GET    /billing/:id            - Get billing by ID
PUT    /billing/:id            - Update billing
DELETE /billing/:id            - Delete billing
GET    /billing/pending/list   - Get pending payments
```

**Sample Request (POST):**
```json
{
  "patientId": "PATIENT_MONGODB_ID",
  "invoiceNumber": "INV-001",
  "description": "Therapy Session - Abhyanga",
  "amount": 1500,
  "therapyId": "THERAPY_MONGODB_ID",
  "paymentMethod": "Cash",
  "paymentStatus": "Pending",
  "dueDate": "2026-03-06"
}
```

### 6. **Reports Management**
```
GET    /reports            - Get all reports
POST   /reports            - Create new report
GET    /reports/:id        - Get report by ID
PUT    /reports/:id        - Update report
DELETE /reports/:id        - Delete report
```

**Sample Request (POST):**
```json
{
  "patientId": "PATIENT_MONGODB_ID",
  "doctorId": "DOCTOR_MONGODB_ID",
  "reportType": "Medical Assessment",
  "findings": "Patient shows signs of vata imbalance",
  "recommendations": "Warm oil massage and dietary changes",
  "status": "Completed"
}
```

### 7. **Admin Management**
```
GET    /admins             - Get all admins
POST   /admins             - Create new admin
GET    /admins/:id         - Get admin by ID
PUT    /admins/:id         - Update admin
DELETE /admins/:id         - Delete admin
```

**Sample Request (POST):**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "securepwd123",
  "phone": "9876543210",
  "role": "Admin",
  "permissions": ["read", "write", "delete"],
  "status": "Active"
}
```

### 8. **Reminders**
```
POST   /reminders          - Send appointment reminder
```

**Sample Request (POST):**
```json
{
  "email": "patient@example.com",
  "phone": "9876543210",
  "patientId": "PATIENT_MONGODB_ID",
  "patientName": "John Doe",
  "date": "2026-02-15",
  "type": "appointment"
}
```

### 9. **Health Check**
```
GET    /health             - Get detailed health status
GET    /                   - Basic health check
```

---

## 📂 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── Patient.js            # Patient schema
│   ├── Doctor.js             # Doctor schema
│   ├── Therapy.js            # Therapy schema
│   ├── Admin.js              # Admin schema
│   ├── Stock.js              # Stock schema
│   ├── Report.js             # Report schema
│   └── Billing.js            # Billing schema
├── routes/
│   ├── patients.js           # Patient endpoints
│   ├── doctors.js            # Doctor endpoints
│   ├── therapies.js          # Therapy endpoints
│   ├── admins.js             # Admin endpoints
│   ├── stock.js              # Stock endpoints
│   ├── reports.js            # Report endpoints
│   ├── billing.js            # Billing endpoints
│   └── reminders.js          # Reminder endpoints
├── server.js                 # Main server file
└── data/                     # Legacy JSON data (optional)

.env                          # Environment variables
```

---

## 🔧 Technology Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin request handling
- **dotenv** - Environment variable management
- **Nodemon** - Auto-reload during development

---

## 🌐 Database Schema

All models include:
- Automatic timestamps (`createdAt`, `updatedAt`)
- Validation on required fields
- Proper data types and constraints
- References between related models (e.g., Therapy → Patient & Doctor)

---

## 📝 Usage Examples

### Using cURL

```bash
# Get all patients
curl http://localhost:4000/api/patients

# Create a patient
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

# Get specific patient
curl http://localhost:4000/api/patients/PATIENT_ID

# Update patient
curl -X PUT http://localhost:4000/api/patients/PATIENT_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "Inactive"}'

# Delete patient
curl -X DELETE http://localhost:4000/api/patients/PATIENT_ID
```

### Using Postman

1. Import the API endpoints into Postman
2. Set base URL to `http://localhost:4000/api`
3. Use the sample JSON bodies provided above
4. Test each endpoint with appropriate HTTP methods

### Using Node.js/Fetch

```javascript
// Get all patients
const response = await fetch('http://localhost:4000/api/patients');
const patients = await response.json();
console.log(patients);

// Create patient
const newPatient = await fetch('http://localhost:4000/api/patients', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    age: 45,
    gender: 'Male',
    address: '123 Street'
  })
});
const result = await newPatient.json();
console.log(result);
```

---

## 🔐 Security Notes

- Passwords are stored but **NOT encrypted** in the current setup
  - Use `bcrypt` for production
- Implement **authentication/authorization** before deployment
- Add input validation middleware
- Use environment variables for sensitive data
- Enable HTTPS in production

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running or check your `MONGODB_URI` in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution:** Change PORT in `.env` or kill the process using port 4000

### Module Not Found
```
Error: Cannot find module 'mongoose'
```
**Solution:** Run `npm install`

### CORS Errors
The server has CORS enabled for all origins. Adjust this in `server.js` for production:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 📦 Environment Variables

Create `.env` file in the root directory:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/panchakarma
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/panchakarma
```

---

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

### Deploy to AWS/Azure/DigitalOcean

1. Set up Node.js environment
2. Install MongoDB or use managed database service
3. Set environment variables
4. Run: `npm install && npm run server`

---

## 📞 Support

For issues or questions, check:
- MongoDB documentation: https://docs.mongodb.com
- Express.js guide: https://expressjs.com
- Mongoose documentation: https://mongoosejs.com

---

## 📄 License

MIT License - Feel free to use this project

---

## ✅ Completed Features

- ✓ MongoDB integration with Mongoose
- ✓ 7 complete resource models (Patient, Doctor, Therapy, Admin, Stock, Report, Billing)
- ✓ Full CRUD operations for all resources
- ✓ Proper error handling
- ✓ Request logging
- ✓ Health check endpoints
- ✓ CORS enabled
- ✓ Environment variable configuration

## 📋 Future Enhancements

- [ ] User authentication (JWT)
- [ ] Role-based access control
- [ ] Email/SMS notifications (Nodemailer, Twilio)
- [ ] File upload handling
- [ ] Advanced search and filtering
- [ ] Pagination
- [ ] Data export (PDF, Excel)
- [ ] API rate limiting
- [ ] Comprehensive logging
