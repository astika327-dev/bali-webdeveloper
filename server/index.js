require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // kalau Node <18

const app = express();
const PORT = process.env.PORT || 3001;

const CONTACT_WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;
const CONTACT_WEBHOOK_KEY = process.env.CONTACT_WEBHOOK_KEY;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/contact', async (req, res) => {
  const { name, email, whatsapp, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'invalid_payload',
      message: 'Name, email, and message are required.'
    });
  }

  if (!CONTACT_WEBHOOK_URL) {
    return res.status(503).json({
      error: 'webhook_unavailable',
      message: 'Contact form is temporarily unavailable. Please try again later.'
    });
  }

  const clean = (value) => (value || '').toString().trim();
  const payload = {
    name: clean(name),
    email: clean(email),
    whatsapp: clean(whatsapp),
    message: clean(message)
  };

  try {
    const webhookResponse = await fetch(CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(CONTACT_WEBHOOK_KEY ? { Authorization: `Bearer ${CONTACT_WEBHOOK_KEY}` } : {})
      },
      body: JSON.stringify({
        ...payload,
        submittedAt: new Date().toISOString()
      })
    });

    if (!webhookResponse.ok) {
      const detail = await webhookResponse.text().catch(() => '');
      throw new Error(`Webhook responded with ${webhookResponse.status}${detail ? `: ${detail}` : ''}`);
    }

    res.json({
      success: true,
      message: 'Thanks! Your message has been sent.'
    });
  } catch (error) {
    console.error('Failed to forward contact payload:', error);
    res.status(500).json({
      error: 'webhook_error',
      message: 'Failed to send message. Please try again later.'
    });
  }
});

app.post('/api/or', async (req, res) => {
  try {
    const r = await fetch("https://<nama-worker>.workers.dev/api/or", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "proxy_error", detail: e.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Dev proxy berjalan di http://localhost:${PORT}`);
});
