const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const openaiProxy = require('./openaiProxy');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/api/openai', openaiProxy);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});
