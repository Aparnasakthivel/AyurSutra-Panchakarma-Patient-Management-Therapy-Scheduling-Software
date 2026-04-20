# Notification System Setup Guide

This document provides step-by-step instructions for setting up the complete notification system with EmailJS, Telegram, and Browser Notifications.

## 📧 EmailJS Setup (for Backend SMTP-less Email)

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email

### 2. Create Email Service
1. In EmailJS Dashboard, go to "Email Services"
2. Click "Create New Service"
3. Select "Gmail" (or your email provider)
4. Name it (e.g., "panchakarma-service")
5. Connect your Gmail account
6. Save the Service ID

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Name: "appointment_reminder"
4. Use this template:

```
Subject: Appointment Reminder - {{patient_name}}

Dear {{patient_name}},

This is your appointment reminder:

📅 Date & Time: {{appointment_date}}
📍 Location: Panchakarma Therapy Center
❤️ Please arrive 10 minutes early.

If you need to reschedule, contact us immediately.

Best regards,
Panchakarma Therapy Team
```

4. Save Template ID

### 4. Update .env File
```
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxxx
```

---

## 🤖 Telegram Setup

### 1. Create Telegram Bot
1. Open Telegram and search for **@BotFather**
2. Send `/start`
3. Send `/newbot`
4. Follow the prompts:
   - Give your bot a name (e.g., "Panchakarma Notifications")
   - Give it a username (e.g., "panchakarma_bot")
5. Copy the **API Token** provided

### 2. Get Your Chat ID
1. Search for **@userinfobot** in Telegram
2. Send any message
3. It will return your Chat ID (starts with a number)

### 3. Update .env File
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

### 4. Test Telegram
```bash
curl "https://api.telegram.org/botYOUR_TOKEN/sendMessage?chat_id=YOUR_CHAT_ID&text=Test"
```

---

## SMTP Setup (Alternative for Backend)

For production email sending without EmailJS:

### Gmail Setup
1. Enable 2-Factor Authentication
2. Create an App Password (16 characters)
3. Update .env:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

---

## 🔔 Browser Notifications Setup

No configuration needed! The app automatically requests permission when you log in.

**Features:**
- Appointment reminders
- Stock alerts
- System notifications
- Customizable notification types

---

## 🧪 Testing the Notification System

### Via API (Backend)
```bash
curl -X POST http://localhost:4000/api/reminders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "phone": "9876543210",
    "patientId": "123",
    "patientName": "John Doe",
    "appointmentDate": "2026-03-25T10:30:00Z"
  }'
```

### Via Frontend
1. Log in to the app (admin / 1234)
2. Navigate to Patient → Create Patient
3. Fill in the form with:
   - Valid email address
   - Valid phone number (optional)
   - Next Visit Date (today or future)
4. Submit the form
5. Check:
   - Console for logs
   - Email inbox
   - Telegram chat
   - Browser notification

---

## 📊 Notification Flow

```
Patient Created
    ↓
Next Visit Date + Email provided?
    ↓
YES → Schedule Reminders
    ↓
Send via:
├─ 📧 Email (EmailJS or SMTP)
├─ 📱 SMS (Telegram as workaround)
└─ 🔔 Browser Notification
    ↓
Reminder Log Saved to DB
```

---

## 🚀 Deployment Considerations

### Production Environment Variables
```env
NODE_ENV=production
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com
```

### Best Practices
1. Never commit .env files with real credentials
2. Use environment-specific .env files
3. Rotate tokens periodically
4. Monitor email delivery rates
5. Set up error logging and alerts

---

## 🐛 Troubleshooting

### "Reminder scheduled but not sent"
- Check browser console for errors
- Verify email credentials in .env
- Check backend logs: `npm run server:dev`
- Verify appointment date is in future

### "Telegram message not received"
- Verify TELEGRAM_BOT_TOKEN is correct
- Check TELEGRAM_CHAT_ID
- Test with curl command above

### "Browser notifications not appearing"
- Check if notifications are permitted in browser settings
- Look for notification permission prompt on login
- Check browser console for errors

### "Email failing silently"
- Check if SMTP credentials are correct
- For Gmail: use App Password, not regular password
- Enable "Less secure app access" if not using 2FA
- Check email spam folder

---

## 📚 Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [MDN - Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [SMTP Specifications](https://nodemailer.com/smtp/)

