import React, { useState, useEffect } from 'react';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, sent, pending

  useEffect(() => {
    fetchReminders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchReminders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/reminders');
      const data = await response.json();
      
      if (response.ok) {
        setReminders(data.reminders || []);
        setError('');
      } else {
        setError(data.error || 'Failed to fetch reminders');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredReminders = () => {
    if (filter === 'sent') return reminders.filter(r => r.sent);
    if (filter === 'pending') return reminders.filter(r => !r.sent);
    return reminders;
  };

  const getStatusBadge = (reminder) => {
    const now = new Date();
    const scheduledFor = new Date(reminder.scheduledFor);
    
    if (reminder.sent) {
      return <span style={{color: '#10b981', fontSize: '0.85rem', fontWeight: 'bold'}}>✓ SENT</span>;
    } else if (scheduledFor > now) {
      return <span style={{color: '#f59e0b', fontSize: '0.85rem', fontWeight: 'bold'}}>⏰ PENDING</span>;
    } else {
      return <span style={{color: '#ef4444', fontSize: '0.85rem', fontWeight: 'bold'}}>✗ FAILED</span>;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'immediate': '⚡ Immediate',
      'day-before': '📅 24hrs Before',
      'hour-before': '⏱️ 1hr Before'
    };
    return labels[type] || type;
  };

  return (
    <div className="page">
      <div style={{ marginBottom: '20px' }}>
        <h2>📬 Appointment Reminders</h2>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Managed reminders: {reminders.length} total 
          ({reminders.filter(r => r.sent).length} sent, {reminders.filter(r => !r.sent).length} pending)
        </p>
      </div>

      {/* Filter & Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'all' ? '#0f766e' : '#e2e8f0',
            color: filter === 'all' ? 'white' : '#0f172a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: filter === 'all' ? 'bold' : 'normal'
          }}
        >
          All ({reminders.length})
        </button>
        <button
          onClick={() => setFilter('sent')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'sent' ? '#10b981' : '#e2e8f0',
            color: filter === 'sent' ? 'white' : '#0f172a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Sent ({reminders.filter(r => r.sent).length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'pending' ? '#f59e0b' : '#e2e8f0',
            color: filter === 'pending' ? 'white' : '#0f172a',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Pending ({reminders.filter(r => !r.sent).length})
        </button>
        <button
          onClick={fetchReminders}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: '8px',
          padding: '12px',
          color: '#991b1b',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          ⏳ Loading reminders...
        </div>
      ) : getFilteredReminders().length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          📭 No reminders {filter !== 'all' ? `(${filter})` : ''}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f0f9f8',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Patient</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Appointment</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Scheduled</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredReminders().map((reminder) => (
                <tr
                  key={reminder._id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: reminder.sent ? '#f0fdf4' : '#fefce8'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <strong>{reminder.patientName}</strong>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getTypeLabel(reminder.type)}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>
                    {reminder.email || '—'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>
                    {reminder.phone || '—'}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem' }}>
                    {new Date(reminder.appointmentDate).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.9rem', color: '#666' }}>
                    {new Date(reminder.scheduledFor).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {getStatusBadge(reminder)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Section */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f0f9f8',
        borderRadius: '8px',
        borderLeft: '4px solid #0f766e'
      }}>
        <h3 style={{ marginTop: 0 }}>📋 System Information</h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Status:</strong> Reminders are automatically scheduled when patients are created with next visit dates</li>
          <li><strong>Types:</strong> Immediate reminder + 24-hour before reminder</li>
          <li><strong>Notifications:</strong> Email (SMTP or mock) + Telegram (if configured) + Browser notifications</li>
          <li><strong>Auto-refresh:</strong> Page refreshes every 30 seconds</li>
          <li><strong>Database:</strong> Check MongoDB for persistent records</li>
        </ul>
      </div>

      {/* Quick Test Section */}
      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        borderLeft: '4px solid #f59e0b'
      }}>
        <h3 style={{ marginTop: 0 }}>🧪 Quick Test</h3>
        <p style={{ margin: '10px 0' }}>
          To create a test reminder:
        </p>
        <ol style={{ margin: '10px 0', paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>Go to Patient module</li>
          <li>Create a new patient with:
            <ul style={{ marginTop: '5px' }}>
              <li>Valid email address</li>
              <li>Next Visit Date: Today or tomorrow</li>
            </ul>
          </li>
          <li>Reminders will be automatically scheduled</li>
          <li>You'll see them appear here in a few seconds</li>
        </ol>
      </div>
    </div>
  );
}
