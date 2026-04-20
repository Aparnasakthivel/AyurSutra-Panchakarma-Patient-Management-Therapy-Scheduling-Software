const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

let notificationService;
try {
  notificationService = require('../utils/notifications');
} catch (e) {
  console.error('⚠️ Failed to load notification service:', e.message);
  notificationService = {
    sendAppointmentReminder: async () => ({ email: { ok: true }, sms: { ok: true }, telegram: { ok: true } }),
    sendEmail: async () => ({ ok: true, mock: true })
  };
}

const { sendAppointmentReminder, sendEmail } = notificationService;

// In-memory timers to allow cancellation if needed
const timers = new Map();

async function dispatch(reminder) {
  try {
    const when = new Date(reminder.scheduledFor).toISOString();
    console.log(`\n[Reminder Dispatch] Starting for ${reminder.patientName} at ${when}`);

    const result = await sendAppointmentReminder(
      reminder.patientName,
      reminder.email,
      reminder.phone,
      reminder.appointmentDate
    );

    reminder.sent = true;
    reminder.sentAt = new Date();
    reminder.result = result;
    await reminder.save();

    console.log(`[Reminder Dispatch] ✓ Success for ${reminder.patientName}`);
  } catch (err) {
    console.error(`[Reminder Dispatch] ✗ Error:`, err.message);
    try {
      reminder.error = err.message;
      await reminder.save();
    } catch (saveErr) {
      console.error('[Reminder Dispatch] Failed to save error:', saveErr.message);
    }
  }
}

function scheduleReminder(reminder) {
  try {
    const id = reminder._id.toString();
    const delay = new Date(reminder.scheduledFor).getTime() - Date.now();

    if (delay <= 0) {
      console.log(`[Reminder Schedule] IMMEDIATE for ${reminder.patientName}`);
      dispatch(reminder);
      return;
    }

    const delaySeconds = (delay / 1000).toFixed(1);
    console.log(`[Reminder Schedule] Queued for ${reminder.patientName} in ${delaySeconds}s`);

    const t = setTimeout(() => {
      dispatch(reminder).catch(consoleError);
      timers.delete(id);
    }, delay);
    timers.set(id, t);
  } catch (error) {
    console.error('[Reminder Schedule] Error:', error.message);
  }
}

function consoleError(err) {
  console.error('[Reminder] Async error:', err?.message || err);
}

// POST /api/reminders
// payload: { email, phone, patientId, patientName, appointmentDate }
router.post('/', async (req, res) => {
  try {
    const { email, phone, patientId, patientName, appointmentDate } = req.body;

    // Validation
    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }
    if (!patientId || !patientName) {
      return res.status(400).json({ error: 'Missing patientId or patientName' });
    }
    if (!appointmentDate) {
      return res.status(400).json({ error: 'Missing appointmentDate' });
    }

    const apptDate = new Date(appointmentDate);
    if (isNaN(apptDate.getTime())) {
      return res.status(400).json({ error: 'Invalid appointmentDate format' });
    }

    console.log(`\n[API] New reminder request for ${patientName} on ${apptDate.toLocaleString()}`);

    // Create immediate reminder
    const immediate = new Reminder({
      patientId,
      patientName,
      email: email || null,
      phone: phone || null,
      appointmentDate: apptDate,
      scheduledFor: new Date(),
      type: 'immediate',
      sent: false
    });
    await immediate.save();
    console.log(`[API] ✓ Saved immediate reminder to DB`);
    scheduleReminder(immediate);

    // Create 24-hour before reminder
    const dayBefore = new Date(apptDate.getTime() - 24 * 60 * 60 * 1000);
    const scheduled = new Reminder({
      patientId,
      patientName,
      email: email || null,
      phone: phone || null,
      appointmentDate: apptDate,
      scheduledFor: dayBefore,
      type: 'day-before',
      sent: false
    });
    await scheduled.save();
    console.log(`[API] ✓ Saved day-before reminder to DB`);

    // Only schedule if future
    if (dayBefore > new Date()) {
      scheduleReminder(scheduled);
    } else {
      console.log(`[API] Day-before is past, skipping schedule`);
    }

    const response = {
      success: true,
      message: 'Reminders scheduled successfully',
      reminders: [
        {
          id: immediate._id,
          type: 'immediate',
          scheduledFor: immediate.scheduledFor,
          status: 'Dispatching now...'
        },
        {
          id: scheduled._id,
          type: 'day-before',
          scheduledFor: scheduled.scheduledFor,
          status: dayBefore > new Date() ? 'Queued' : 'Past date'
        }
      ]
    };

    console.log(`[API] ✓ Response sent`);
    return res.json(response);
  } catch (err) {
    console.error(`[API] ✗ Error:`, err.message);
    console.error(err.stack);
    return res.status(500).json({
      error: 'Failed to schedule reminders',
      details: err.message,
      hint: 'Check backend logs for more details'
    });
  }
});

// GET /api/reminders - Get all reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ scheduledFor: -1 }).limit(50);
    return res.json({ reminders, total: reminders.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch reminders', details: err.message });
  }
});

// POST /api/reminders/test-email - Send an immediate test reminder email
router.post('/test-email', async (req, res) => {
  try {
    const { email = 'aparnasakthivel03102006@gmail.com' } = req.body;
    const result = await sendEmail(
      email,
      'Panchakarma Test Notification',
      'This is a test notification email from Panchakarma reminder system.',
      '<p>This is a <strong>test notification</strong> email from Panchakarma reminder system.</p>'
    );

    return res.json({ success: true, email, result });
  } catch (err) {
    console.error('[API][test-email] Error:', err.message);
    return res.status(500).json({ error: 'Failed to send test email', details: err.message });
  }
});

// GET /api/reminders/:patientId - Get reminders for a patient
router.get('/:patientId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ patientId: req.params.patientId }).sort({ scheduledFor: -1 });
    return res.json({ reminders, total: reminders.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch reminders', details: err.message });
  }
});

module.exports = router;
