const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const openaiProxy = require('./openaiProxy');

dotenv.config();

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('sk-xxxx')) {
  throw new Error('OPENAI_API_KEY belum di-set dengan benar. Edit server/.env lalu restart.');
}


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/api/openai', openaiProxy);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


app.listen(PORT, () => {
  console.log(`Server berjalan pada http://localhost:${PORT}`);
});

