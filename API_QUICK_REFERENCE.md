# API Quick Reference Guide

## 🚀 Quick Start (Copy & Paste Commands)

### 1. Start the Server
```bash
npm run server:dev
```
Expected: `✓ Server running on http://localhost:4000`

### 2. Initialize Sample Data
```bash
node backend/scripts/initializeDB.js
```
Expected: `✓ Database initialized successfully!`

### 3. Test API (Pick One Method)

#### Using Browser (Simplest)
Visit: `http://localhost:4000/api/patients`

#### Using Terminal (cURL)
```bash
curl http://localhost:4000/api/patients
```

#### Using VS Code REST Client
Install "REST Client" extension, create `test.http`:
```http
GET http://localhost:4000/api/patients
```
Click "Send Request"

#### Using Postman
Import `Panchakarma-API.postman_collection.json` file included in project

---

## 📝 Complete API Examples

### 1. PATIENTS

#### Get All Patients
```bash
curl http://localhost:4000/api/patients
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "age": 45,
    "gender": "Male",
    "address": "Mumbai, Maharashtra",
    "status": "Active",
    "createdAt": "2026-02-06T10:30:00Z",
    "updatedAt": "2026-02-06T10:30:00Z"
  }
]
```

#### Create Patient
```bash
curl -X POST http://localhost:4000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Patient",
    "email": "newpatient@example.com",
    "phone": "9876543210",
    "age": 35,
    "gender": "Female",
    "address": "Delhi, India",
    "medicalHistory": "No issues",
    "allergies": "None",
    "status": "Active"
  }'
```

**Response:**
```json
{
  "success": true,
  "patient": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "New Patient",
    "email": "newpatient@example.com",
    "age": 35,
    "status": "Active",
    "createdAt": "2026-02-06T11:45:00Z"
  }
}
```

#### Get Single Patient
```bash
curl http://localhost:4000/api/patients/507f1f77bcf86cd799439011
```

#### Update Patient
```bash
curl -X PUT http://localhost:4000/api/patients/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "OnLeave",
    "address": "New Address, City"
  }'
```

#### Delete Patient
```bash
curl -X DELETE http://localhost:4000/api/patients/507f1f77bcf86cd799439011
```

---

### 2. DOCTORS

#### Get All Doctors
```bash
curl http://localhost:4000/api/doctors
```

#### Create Doctor
```bash
curl -X POST http://localhost:4000/api/doctors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Sharma",
    "email": "sharma@example.com",
    "phone": "9876543220",
    "specialization": "Massage Therapy",
    "qualifications": "BAMS",
    "licenseNumber": "AY999888",
    "yearsOfExperience": 10,
    "consultationFee": 600,
    "availability": "Available"
  }'
```

---

### 3. THERAPIES

#### Get All Therapies (with Patient & Doctor Details)
```bash
curl http://localhost:4000/api/therapies
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439050",
    "name": "Abhyanga Massage",
    "description": "Full body oil massage",
    "duration": 60,
    "cost": 1500,
    "patientId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Rajesh Kumar",
      "email": "rajesh@example.com"
    },
    "doctorId": {
      "_id": "507f1f77bcf86cd799439020",
      "name": "Dr. Vaidya Sharma",
      "specialization": "Panchakarma Therapy"
    },
    "status": "Scheduled",
    "startDate": "2026-02-10T10:00:00Z",
    "endDate": "2026-02-20T10:00:00Z"
  }
]
```

#### Create Therapy
First get a Patient ID and Doctor ID from GET endpoints above, then:

```bash
curl -X POST http://localhost:4000/api/therapies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Shirodhara",
    "description": "Head massage with oil",
    "duration": 45,
    "cost": 2000,
    "patientId": "507f1f77bcf86cd799439011",
    "doctorId": "507f1f77bcf86cd799439020",
    "startDate": "2026-02-12T15:00:00Z",
    "endDate": "2026-02-22T15:00:00Z",
    "status": "Scheduled",
    "notes": "For stress relief"
  }'
```

#### Update Therapy Status
```bash
curl -X PUT http://localhost:4000/api/therapies/507f1f77bcf86cd799439050 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "InProgress"
  }'
```

---

### 4. STOCK MANAGEMENT

#### Get All Stock Items
```bash
curl http://localhost:4000/api/stock
```

#### Get Low Stock Alert
```bash
curl http://localhost:4000/api/stock/low-stock/alert
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439060",
    "itemName": "Neem Powder",
    "category": "Herbs",
    "quantity": 5,
    "minimumStock": 5,
    "unit": "kg",
    "status": "LOW - Reorder needed!"
  }
]
```

#### Create Stock Item
```bash
curl -X POST http://localhost:4000/api/stock \
  -H "Content-Type: application/json" \
  -d '{
    "itemName": "Brahmi Oil",
    "category": "Oils",
    "quantity": 100,
    "unit": "Liters",
    "unitCost": 300,
    "supplier": "Herb Suppliers Inc",
    "expiryDate": "2027-06-30",
    "minimumStock": 15
  }'
```

#### Update Stock Quantity
```bash
curl -X PUT http://localhost:4000/api/stock/507f1f77bcf86cd799439060 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50,
    "lastRestocked": "2026-02-06T10:00:00Z"
  }'
```

---

### 5. BILLING / PAYMENTS

#### Get All Billing Records
```bash
curl http://localhost:4000/api/billing
```

#### Get Pending Payments Only
```bash
curl http://localhost:4000/api/billing/pending/list
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439070",
    "invoiceNumber": "INV-001",
    "patientId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Rajesh Kumar"
    },
    "amount": 1500,
    "paymentStatus": "Pending",
    "dueDate": "2026-02-20"
  }
]
```

#### Create Billing Record
```bash
curl -X POST http://localhost:4000/api/billing \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "507f1f77bcf86cd799439011",
    "invoiceNumber": "INV-003",
    "description": "Shirodhara Therapy Session",
    "amount": 2000,
    "therapyId": "507f1f77bcf86cd799439050",
    "paymentMethod": "Card",
    "paymentStatus": "Pending",
    "dueDate": "2026-02-28"
  }'
```

#### Mark Payment as Paid
```bash
curl -X PUT http://localhost:4000/api/billing/507f1f77bcf86cd799439070 \
  -H "Content-Type: application/json" \
  -d '{
    "paymentStatus": "Paid",
    "paidDate": "2026-02-06T14:00:00Z"
  }'
```

---

### 6. MEDICAL REPORTS

#### Get All Reports
```bash
curl http://localhost:4000/api/reports
```

#### Create Medical Report
```bash
curl -X POST http://localhost:4000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "507f1f77bcf86cd799439011",
    "doctorId": "507f1f77bcf86cd799439020",
    "reportType": "Assessment Report",
    "findings": "Patient shows vata imbalance with joint stiffness and poor digestion",
    "recommendations": "Warm oil massage 3x week, warm foods diet, meditation daily",
    "status": "Completed",
    "fileUrl": "https://example.com/reports/AY001.pdf"
  }'
```

---

### 7. ADMIN MANAGEMENT

#### Get All Admins (Passwords Hidden)
```bash
curl http://localhost:4000/api/admins
```

#### Create Admin User
```bash
curl -X POST http://localhost:4000/api/admins \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Manager User",
    "email": "manager@example.com",
    "password": "securepass123",
    "phone": "9876543230",
    "role": "Manager",
    "permissions": ["read", "write"],
    "status": "Active"
  }'
```

---

### 8. REMINDERS & NOTIFICATIONS

#### Send Appointment Reminder
```bash
curl -X POST http://localhost:4000/api/reminders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "patientId": "507f1f77bcf86cd799439011",
    "patientName": "Rajesh Kumar",
    "date": "2026-02-15",
    "type": "appointment"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Reminder queued successfully"
}
```

---

### 9. HEALTH CHECK

#### Get Detailed Health Status
```bash
curl http://localhost:4000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-06T12:00:00Z",
  "uptime": 3600,
  "mongodb": {
    "connected": true,
    "host": "localhost",
    "database": "panchakarma"
  }
}
```

---

## 🔑 Important Field Mappings

### When Creating References (Therapies, Billing, Reports)
You need actual MongoDB IDs from:
- Get Patient ID: `curl http://localhost:4000/api/patients` → copy `_id` field
- Get Doctor ID: `curl http://localhost:4000/api/doctors` → copy `_id` field
- Get Therapy ID: `curl http://localhost:4000/api/therapies` → copy `_id` field

Example:
```json
{
  "patientId": "COPY_THIS_ID_FROM_PATIENTS_LIST",
  "doctorId": "COPY_THIS_ID_FROM_DOCTORS_LIST"
}
```

---

## ✅ Success Response Pattern
```json
{
  "success": true,
  "patient/doctor/therapy": { /* the created/updated object */ }
}
```

## ❌ Error Response Pattern
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (invalid data) |
| 404 | Not found |
| 500 | Server error |

---

## 💡 Pro Tips

1. **Save IDs**: When you create resources, copy the `_id` from response to use later
2. **Populate Check**: Therapies, Billing, and Reports return full patient/doctor details
3. **Update Only Changed**: Send only fields you want to change on PUT requests
4. **Query Parameters**: Add `?status=Active` to filter (not yet implemented, but can be added)

---

## 🔒 Security Note
In production:
- [ ] Don't store passwords in plain text (use bcrypt)
- [ ] Add JWT authentication
- [ ] Add input validation
- [ ] Use HTTPS
- [ ] Implement rate limiting

---

## 🆘 Troubleshooting Commands

```bash
# Check if server is running
curl http://localhost:4000/api/health

# Check database connection
# Open MongoDB Compass and connect to localhost:27017

# View all database collections
mongosh
> use panchakarma
> show collections

# Count documents in a collection
> db.patients.countDocuments()
```

---

For complete documentation, see:
- **Backend README**: `backend/README.md`
- **Setup Guide**: `BACKEND_SETUP.md`
- **Postman Collection**: `Panchakarma-API.postman_collection.json`
