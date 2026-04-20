# 📋 STAFF QUICK REFERENCE - Notification System

## 🎯 For Clinic Staff

### Creating Patient with Appointment Reminder

#### Step 1: Fill Patient Information
```
✓ Full Name       → [Patient Name]
✓ Email          → [person@email.com]  ← IMPORTANT!
✓ Phone          → [10-digit number]
✓ DOB            → [Pick from calendar]
✓ Age            → [Calculated automatically]
✓ Gender         → [Select one]
✓ Blood Group    → [Select one]
✓ Address        → [Full address]
✓ City/State     → [Select from dropdown]
```

#### Step 2: ADD APPOINTMENT TO REMINDER SYSTEM
```
⭐ Next Visit Date   → [Pick a FUTURE date] ← REQUIRED
⭐ Next Visit Time   → [10:00 - 18:00]
   
   Example: Next Tuesday at 2:30 PM
```

#### Step 3: Save Patient
```
Click: [Submit]

Result:
✅ Patient saved to system
✅ Immediate reminder scheduled
✅ Patient will get notification
✅ Admin will get Telegram alert
```

---

## 📱 What Patient Receives

### Notification 1: Immediate (When created)
```
📧 EMAIL
Subject: Appointment Reminder - [Patient Name]
Body: Your appointment is confirmed. 
      Please arrive 10 minutes early.

⏰ TIMING: RIGHT NOW

🔔 BROWSER NOTIFICATION
[Shows pop-up on screen]

📱 TELEGRAM (If admin enabled)
[Alert sent to clinic group]
```

### Notification 2: 24 Hours Before
```
📧 EMAIL
Subject: Appointment Reminder
Body: Your appointment is TOMORROW at [TIME]

⏰ TIMING: 24 HOURS BEFORE appointment

🔔 BROWSER NOTIFICATION
[Shows pop-up reminder]

📱 TELEGRAM (If admin enabled)
[Alert sent to clinic group]
```

---

## ✅ Checklist Before Submitting

```
Before clicking Submit, verify:

□ Name: Filled and min 2 characters
□ Email: Valid format (xxx@xxx.com)
□ Phone: 10-digit number
□ DOB: Date is in past
□ Age: Between 1-100
□ Gender: Selected
□ Blood Group: Selected  
□ Address: Filled
□ City/State/Country: Selected
□ Pincode: Exactly 6 digits

FOR REMINDERS:
□ Next Visit Date: MUST be TODAY or FUTURE
□ Next Visit Time: Must be between 09:00-18:00
```

---

## 🔍 Monitor Reminders

### View All Reminders
1. Click: ** Reminders** (in left sidebar)
2. You'll see table with:
   - Patient Name
   - Email address
   - Phone number
   - Appointment date/time
   - Status: ✓ SENT or ⏰ PENDING

### Filter Reminders
```
Button: [All (N)]       → Show all reminders
Button: [Sent (N)]      → Show delivered only
Button: [Pending (N)]   → Show waiting reminders
Button: [🔄 Refresh]    → Update list now
```

### Reminder Status Meanings
```
✓ SENT              → Successfully delivered
⏰ PENDING           → Waiting to be sent
✗ FAILED            → Did not send (check logs)
```

---

## 🐛 Troubleshooting

### Issue: Patient doesn't get reminder
```
✓ Step 1: Did you enter an EMAIL? [Required]
✓ Step 2: Did you set Next Visit Date? [Required]
✓ Step 3: Check reminders page - is it there?
✓ Step 4: Tell admin to check backend logs

Action: Contact admin if still not working
```

### Issue: "Invalid appointmentDate" error
```
✗ Don't type the date manually
✓ Use the calendar picker
✓ Make sure date is in FUTURE (not past)

Action: Click back and use date picker
```

### Issue: Patient gets multiple reminders
```
✓ This is NORMAL! System sends 2 reminders:
  1. Immediate reminder (when created)
  2. 24-hour reminder (before appointment)

Action: No action needed - this is designed
```

---

## 📊 Daily Workflow

### Morning (8:00 AM)
```
□ Log in with admin account
□ Go to Reminders page
□ Check any PENDING reminders
□ Note any appointments for today
□ REMINDER: Patient will get notification today
```

### During Day
```
□ Create patients as they book
□ System automatically sends reminders
□ Patient gets email, Telegram, browser alert
□ You don't need to send manual reminders!
```

### End of Day
```
□ Check Reminders page
□ Verify all reminders were SENT
□ Note any failures
□ Report issues to admin
```

---

## 💡 Tips & Tricks

### Best Practices
```
✓ ALWAYS fill email field (required for reminders)
✓ Use patient's PRIMARY contact email
✓ Set realistic appointment times (9am-6pm)
✓ Don't create very far future appointments
✓ Review reminder page daily
```

### Don't Do This
```
✗ Don't manually text/call if system sends reminder
✗ Don't create appointment time in past
✗ Don't duplicate patient records
✗ Don't skip phone number (used as backup)
✗ Don't close reminder page too soon
```

---

## 📞 Contact Admin For

```
ISSUE: Email not received
ACTION: Notify admin, check spam folder

ISSUE: Telegram alerts not working  
ACTION: Notify admin - may need configuration

ISSUE: Browser notification missing
ACTION: Allow notifications in browser settings

ISSUE: Reminder never sends
ACTION: Check MongoDB records (admin only)

ISSUE: System not responding
ACTION: Restart backend (admin terminal)
```

---

## 🎓 What The Numbers Mean

### Reminders Page Numbers
```
[All (47)]      → 47 total reminders in system
[Sent (45)]     → 45 successfully delivered
[Pending (2)]   → 2 waiting to be sent

✓ SENT = delivered
⏰ PENDING = scheduled but time not reached yet
```

### Status Colors
```
🟢 GREEN  = Successfully sent
🟡 YELLOW = Waiting to send (scheduled)
🔴 RED    = Failed to send
```

---

## 🔔 What Patient Hears/Sees

### Email Example
```
Subject: Appointment Reminder - Rajesh Kumar

Dear Rajesh Kumar,

This is your appointment reminder:

📅 Date & Time: March 25, 2026 at 10:30 AM
📍 Location: Panchakarma Therapy Center
❤️ Please arrive 10 minutes early.

If you need to reschedule, contact us.

Best regards,
Panchakarma Therapy Team
```

### Browser Notification Example
```
[NOTIFICATION POPUP]

✅ Appointment Reminder
Your appointment is tomorrow at 10:30 AM
at Panchakarma Therapy Center
```

### Telegram Alert (Admin Only)
```
📋 Appointment Reminder
👤 Patient: Rajesh Kumar
📅 Date: March 25, 2026
📧 Email: rajesh@gmail.com
📞 Phone: 9876543210
✓ Status: Sent
```

---

## 🚨 EMERGENCY

### System Down?
```
1. Try logging out and back in
2. Refresh page (F5 or Ctrl+R)
3. Check internet connection
4. Tell admin - they'll restart backend
```

### Patient Missing Email?
```
1. Ask patient to check spam folder
2. Verify email address was correct
3. Cross-check with patient directly
4. Consider sending manual backup
```

### Forgot Login Credentials?
```
Default Credentials:
Username: admin
Password: 1234

Note: Use ONLY these credentials
Contact admin for password reset
```

---

## 📝 Daily Checklist

```
☐ Start day - Check Reminders page for failures
☐ Creating patient - Verify email address correct
☐ Setting appointment - Use date picker
☐ Submitting - Wait for success message
☐ Mid-day - Spot check reminders page  
☐ End of day - Review all reminders sent
☐ Follow-up - Call any no-show patients
```

---

## 💼 For Managers

### KPIs to Track
```
📊 Total Reminders Sent/Day: [____]
📊 Success Rate: [____]%
📊 Patient No-Shows: [____]
📊 Bounce-back Emails: [____]
📊 System Uptime: [____]%
```

### Weekly Report
```
Week of: _______

Metrics:
- Reminders sent: ___
- Delivery success: ___%
- Patient feedback: ____
- System issues: ____

Action items:
1. ________________
2. ________________
3. ________________
```

---

## 🎯 Success Indicators

✅ **Working Properly When:**
```
1. Reminders appear in list after patient creation
2. Status shows ✓ SENT within 30 seconds
3. Patient receives email/notification
4. No error messages in system
5. Page auto-refreshes and shows updates
```

❌ **Issues When:**
```
1. Reminder status stays ⏰ PENDING forever
2. Patient says they didn't get notification
3. Error message appears on screen
4. Page shows "Failed to fetch reminders"
5. System says "Network error"
```

---

**REMEMBER**: This system automatically handles reminders. You just need to:
1. Fill in patient info correctly
2. Set the next appointment date
3. Click submit

The system does the rest!

For help, see your admin or refer to full documentation.

---

**Last Updated**: March 21, 2026  
**For**: Clinic Staff  
**Version**: Quick Reference v1.0

