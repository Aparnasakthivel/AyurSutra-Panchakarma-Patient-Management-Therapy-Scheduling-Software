# 📱 Complete Notification System - Testing & Quick Start Guide

## ✅ What's Been Implemented

Your notification system now supports:

### 1. **📧 Email Notifications** (3 OPTIONS)
   - ✅ Backend SMTP (Gmail, Outlook, etc.)
   - ✅ Browser-based EmailJS (recommended)
   - ✅ Mock mode for testing (currently active)

### 2. **📱 Telegram Notifications**
   - ✅ Real-time admin alerts
   - ✅ Appointment reminders
   - ✅ Stock alerts
   - Status: Ready (needs configuration)

### 3. **🔔 Browser Notifications**
   - ✅ Desktop alerts
   - ✅ Permission management
   - Status: Active (auto-enabled on login)

### 4. **📅 Smart Reminder Scheduling**
   - ✅ Immediate reminder on patient creation
   - ✅ Day-before reminder (24 hours before appointment)
   - ✅ Timezone-aware scheduling
   - ✅ Persistent storage in MongoDB

---

## 🚀 Quick Start (Development)

### Without Email Configuration (Testing Mode)
Just use the system as-is! Everything logs to:
- Browser Console (Frontend notifications)
- Backend Console (Email/SMS logs)
- MongoDB (Reminder records)

### With Email Configuration

#### Option 1: Gmail SMTP (Recommended for Backend)
```env
# .env file
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

#### Option 2: EmailJS (No Backend Config Needed)
```env
# .env file
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxxxx
```

#### Option 3: Telegram (Admin Alerts)
```env
# .env file
TELEGRAM_BOT_TOKEN=123456:ABCDefghij_kl-mnopqrst
TELEGRAM_CHAT_ID=987654321
```

---

## 🧪 Testing the System

### Test 1: Create Patient & Schedule Reminder

1. **Start the Application**
   ```bash
   npm start              # Frontend (port 3000)
   npm run server:dev     # Backend (port 4000)
   ```

2. **Log In**
   - Username: `admin`
   - Password: `1234`

3. **Create a Patient**
   - Click Dashboard → Patient → Create Patient
   - Fill Form:
     - Name: Test User
     - Email: your-email@example.com
     - Phone: 9876543210
     - DOB: Any past date
     - Age: 30
     - Gender: Male/Female
     - Blood Group: O+
     - Country/State/City: Select any
     - **Next Visit Date**: Today or tomorrow ← Important!
     - **Next Visit Time**: 10:00 ← Will schedule reminder

4. **Verify Reminders Scheduled**
   ```
   Expected Output:
   ✅ Reminders scheduled successfully
   
   Console Logs:
   - Dispatching reminder...
   - Reminder sent for: Test User
   - Email sent: {ok: true}
   - Telegram: {ok: true, mock: true}
   ```

5. **Check Reminder Status**
   - Backend logs will show dispatch details
   - MongoDB `reminders` collection will have records
   - Browser console will show fetch logs

### Test 2: API Direct Test

```bash
# Using PowerShell/curl
$body = @{
    email = "test@example.com"
    phone = "9876543210"
    patientId = "test123"
    patientName = "John Doe"
    appointmentDate = "2026-03-25T10:30:00Z"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/reminders" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body `
  -UseBasicParsing
```

### Test 3: Check Scheduled Reminders

```bash
# Get all reminders
curl http://localhost:4000/api/reminders

# Get reminders for specific patient
curl http://localhost:4000/api/reminders/PATIENT_ID
```

---

## 📊 Notification System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Patient Creation Form                                 │   │
│  │ → nextVisitDate + email → POST /api/reminders        │   │
│  │ → Browser Notification Permission                     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓ (HTTP Request)
┌─────────────────────────────────────────────────────────────┐
│                   Backend Express (Node)                     │
│  ┌─ /api/reminders POST ─────────────────────────────────┐  │
│  │ 1. Validate data                                      │  │
│  │ 2. Save to MongoDB                                    │  │
│  │ 3. Schedule immediate + day-before reminders         │  │
│  │ 4. Dispatch notifications:                            │  │
│  │    ├─ sendAppointmentReminder()                       │  │
│  │    ├─ Email (SMTP or mock)                            │  │
│  │    ├─ Telegram (if configured)                        │  │
│  │    └─ SMS (Twilio integration)                        │  │
│  └────────────────────────────────────────────────────────┘ │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├─ MONGODB ─→ [Reminders Collection]
       ├─ EMAIL ──→ Gmail SMTP / Nodemailer
       ├─ TELEGRAM → Telegram Bot API
       └─ BROWSER → Notification API (via frontend)
```

---

## 🔍 Troubleshooting Guides

### ❌ "Reminders scheduled but not sent"

**Check 1: Backend Logs**
```bash
# Look for: "Reminder sent for... ✓"
npm run server:dev
# Watch the console
```

**Check 2: MongoDB Records**
```bash
# Connect to MongoDB and check reminders collection
db.reminders.find({patientName: "Test User"})
# Should show sent: true, sentAt: timestamp
```

**Check 3: Email Configuration**
```bash
# Check .env file
cat .env | grep SMTP
# Or check in container/environment
```

### ❌ "Browser notifications not showing"

**Issue 1: Permission not granted**
- Check browser settings → Notifications → Allow localhost:3000
- Clear site data and reload

**Issue 2: Service Worker**
- Browser notifications need notification permission
- Check console: `requestNotificationPermission()`

### ❌ "Telegram not working"

**Check 1: Bot Token**
```bash
# Verify token format (should be number:string)
echo $TELEGRAM_BOT_TOKEN
# Should look like: 123456789:ABCDefg_hijk-lmnop
```

**Check 2: Chat ID**
```bash
# Should be a number (can be negative for channels)
echo $TELEGRAM_CHAT_ID
# Should look like: 987654321
```

**Check 3: Test Token**
```bash
# PowerShell test
$token = "YOUR_TOKEN"
$chatId = "YOUR_CHAT_ID"
curl "https://api.telegram.org/bot$token/sendMessage?chat_id=$chatId&text=Test"
```

---

## 📈 Monitoring & Logging

### View Backend Logs
```bash
# Terminal 1
npm run server:dev

# Watch for these messages:
# ✓ MongoDB connected
# ✓ Reminder sent for...
# ✓ Rescheduled X pending reminders on startup
```

### Check MongoDB

```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/aysutra

# Check reminders
db.reminders.find().pretty()

# Count sent reminders
db.reminders.countDocuments({sent: true})

# Find failed reminders
db.reminders.find({sent: false})
```

### Browser Console
```javascript
// View in browser console (F12)
console.log(localStorage)  // Check for notification settings
```

---

## 🎯 Production Ready Checklist

- [ ] SMTP credentials configured for Gmail/custom SMTP
- [ ] Telegram bot token and chat ID set
- [ ] Email templates tested
- [ ] Reminders sending successfully
- [ ] MongoDB backups configured
- [ ] Error logging setup
- [ ] Rate limiting configured
- [ ] Timezone handling tested
- [ ] Email delivery monitoring
- [ ] Fallback notifications setup

---

## 📞 Support Endpoints

### Reminders API
```
POST   /api/reminders          - Create reminders
GET    /api/reminders          - Get all reminders
GET    /api/reminders/:id      - Get patient reminders
```

### Health Checks
```
GET    /api/health             - System health
GET    /                       - Server status
```

---

## 🔄 Next Steps

1. **Configure Your Email** (Choose one):
   - Gmail SMTP (easiest for production)
   - EmailJS (easiest for frontend)
   - Your company's SMTP server

2. **Set Up Telegram** (Optional but recommended):
   - Create bot with @BotFather
   - Get your Chat ID
   - Add credentials to .env

3. **Test Everything**:
   - Follow "Test 1: Create Patient"
   - Verify email/telegram/browser notifications

4. **Monitor in Production**:
   - Watch backend logs
   - Check MongoDB for reminder records
   - Set up alerts for failures

---

## 💡 Tips & Best Practices

✅ **DO:**
- Test with real email before production
- Keep .env files secure (never commit)
- Monitor email delivery rates
- Set up reminder reschedule on server restart
- Use database backup for reminders

❌ **DON'T:**
- Use test email addresses in production
- Commit credentials to git
- Rely solely on browser notifications
- Schedule reminders less than 5 minutes before
- Ignore SMTP errors in logs

---

## 📚 Resources

- [Nodemailer Setup](https://nodemailer.com/smtp/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Browser Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [MongoDB Reminders](https://docs.mongodb.com/manual/reference/operator/update/set/)

