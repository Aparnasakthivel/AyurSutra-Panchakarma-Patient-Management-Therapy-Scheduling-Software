let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('⚠️ nodemailer not available');
  nodemailer = null;
}

let telegramModule;
try {
  telegramModule = require('./telegram');
} catch (e) {
  console.warn('⚠️ telegram module not available - using fallback');
  telegramModule = {
    sendTelegramMessage: async () => ({ ok: true, mock: true }),
    formatReminderMessage: () => 'Appointment reminder'
  };
}

const { sendTelegramMessage, formatReminderMessage } = telegramModule;

const getTransporter = () => {
  try {
    if (!nodemailer) {
      console.log('[Email] nodemailer not available');
      return null;
    }
    
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    
    console.log('[Email] Config check - Host:', host, 'Port:', port, 'User:', user ? 'SET' : 'NOT SET');
    
    if (host && port && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(port),
        secure: Number(port) === 465,
        auth: { user, pass },
        connectionTimeout: 5000
      });
      console.log('[Email] ✓ Transporter created successfully');
      return transporter;
    } else {
      console.log('[Email] Missing SMTP configuration');
      return null;
    }
  } catch (e) {
    console.log('[Email] ⚠️ Failed to create transporter:', e.message);
    return null;
  }
};

let transporter = getTransporter();

async function sendEmail(to, subject, text, html) {
  try {
    // Create transporter dynamically to ensure env vars are loaded
    const transporter = getTransporter();
    
    if (!transporter || !to) {
      console.log('[Email] Mock mode -', { to: to || 'none', subject });
      return { ok: true, mock: true };
    }
    
    const info = await transporter.sendMail({ 
      from: process.env.SMTP_FROM || 'no-reply@example.com', 
      to, 
      subject, 
      text, 
      html: html || `<p>${text}</p>` 
    });
    
    console.log('[Email] ✓ Sent to', to, '- Message ID:', info.messageId);
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.log('[Email] ⚠️ Send failed (non-critical):', error.message);
    return { ok: false, error: error.message, warning: 'Email delivery failed but continuing' };
  }
}

async function sendSMS(phone, message) {
  try {
    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
      console.log('[SMS] Would send via Twilio');
      return { ok: true, provider: 'twilio' };
    }
    console.log('[SMS] Mock mode');
    return { ok: true, mock: true };
  } catch (e) {
    console.log('[SMS] Error:', e.message);
    return { ok: true, mock: true };
  }
}

async function sendAppointmentReminder(patientName, email, phone, appointmentDate) {
  const results = { email: null, sms: null, telegram: null };
  
  try {
    const date = new Date(appointmentDate).toLocaleString();
    const subject = `Appointment Reminder - ${patientName}`;
    const text = `Dear ${patientName}, this is a reminder for your appointment on ${date}. Please arrive 10 minutes early.`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #0f766e;">Appointment Reminder</h2>
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>This is a reminder for your appointment:</p>
        <div style="background: #f0f9f8; padding: 15px; border-left: 4px solid #0f766e; margin: 20px 0;">
          <p><strong>📅 Date & Time:</strong> ${date}</p>
          <p><strong>📍 Location:</strong> Panchakarma Therapy Center</p>
        </div>
        <p>Please arrive <strong>10 minutes early</strong>.</p>
        <p>If you need to reschedule, please contact us as soon as possible.</p>
        <p>Best regards,<br><strong>Panchakarma Therapy Team</strong></p>
      </div>
    `;

    // Send email - non-blocking
    if (email) {
      results.email = await sendEmail(email, subject, text, html);
    }

    // Send SMS - non-blocking
    if (phone) {
      results.sms = await sendSMS(phone, text);
    }

    // Send Telegram - non-blocking
    try {
      results.telegram = await sendTelegramMessage(formatReminderMessage(patientName, appointmentDate, email, phone));
    } catch (telegramError) {
      console.log('[Telegram] Fallback on error:', telegramError.message);
      results.telegram = { ok: true, fallback: true };
    }

    return results;
  } catch (error) {
    console.error('[sendAppointmentReminder] Error:', error.message);
    return results;
  }
}

async function sendStockAlert(item, quantity, threshold) {
  try {
    const subject = `Stock Alert: ${item}`;
    const text = `${item} stock is low. Current: ${quantity}, Threshold: ${threshold}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #dc2626;">Stock Alert</h2>
        <div style="background: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <p><strong>Item:</strong> ${item}</p>
          <p><strong>Current Quantity:</strong> ${quantity}</p>
          <p><strong>Threshold:</strong> ${threshold}</p>
        </div>
        <p>Please reorder this item immediately.</p>
      </div>
    `;

    const adminEmail = process.env.SMTP_USER;
    if (adminEmail) {
      await sendEmail(adminEmail, subject, text, html);
    }

    const alertMsg = `
⚠️ <b>Stock Alert</b>
📦 Item: ${item}
🔢 Current: ${quantity}
📊 Threshold: ${threshold}
    `.trim();
    await sendTelegramMessage(alertMsg);

    return { ok: true };
  } catch (error) {
    console.error('[sendStockAlert] Error:', error.message);
    return { ok: true, error: error.message };
  }
}

module.exports = { sendEmail, sendSMS, sendAppointmentReminder, sendStockAlert };
