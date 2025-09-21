const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // kalau Node <18

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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
