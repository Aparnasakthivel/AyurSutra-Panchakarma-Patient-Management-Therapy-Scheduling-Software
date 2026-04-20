let axios;
try {
  axios = require('axios');
} catch (e) {
  console.warn('⚠️ axios not available for Telegram - using mock mode');
  axios = null;
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('[Telegram] Not configured - skipping');
      return { ok: true, mock: true, message: 'Not configured' };
    }

    if (!axios) {
      console.log('[Telegram] axios not available - skipping');
      return { ok: true, mock: true, message: 'axios not available' };
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    }, { timeout: 5000 });
    
    console.log('[Telegram] ✓ Message sent');
    return { ok: true, messageId: response.data?.result?.message_id };
  } catch (error) {
    console.log('[Telegram] ⚠️ Send failed (non-critical):', error.message);
    return { ok: true, warning: 'Telegram delivery failed but continuing', error: error.message };
  }
}

function formatReminderMessage(patientName, appointmentDate, email, phone) {
  const date = new Date(appointmentDate).toLocaleString();
  return `
📋 <b>Appointment Reminder</b>
👤 Patient: ${patientName}
📅 Date: ${date}
📧 Email: ${email || 'N/A'}
📞 Phone: ${phone || 'N/A'}
  `.trim();
}

module.exports = { sendTelegramMessage, formatReminderMessage };
