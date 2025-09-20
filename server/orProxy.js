// server/orProxy.js
module.exports = async function orProxy(req, res) {
  try {
    const { prompt, model } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt kosong' });

    const key = (process.env.OPENROUTER_API_KEY || '').trim();
    if (!key) return res.status(503).json({ error: 'OPENROUTER_API_KEY belum di-set' });

    // model free yang biasanya tersedia; bisa ganti nanti
    const mdl = (model || 'mistralai/mistral-7b-instruct:free').trim();

    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        // dua header ini opsional tapi dianjurkan
        'HTTP-Referer': 'https://bali-webdevelover.com',
        'X-Title': 'Bali WebDevelover Bot'
      },
      body: JSON.stringify({
        model: mdl,
        messages: [
          { role: 'system', content: 'Jawab singkat, jelas, bahasa Indonesia.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    const text = data?.choices?.[0]?.message?.content || '';
    return res.json({ ok: true, model: mdl, output: text || data });
  } catch (e) {
    return res.status(500).json({ error: 'server_error', detail: e.message });
  }
};
