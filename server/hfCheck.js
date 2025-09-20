// server/hfCheck.js
module.exports = async function hfCheck(req, res) {
  try {
    const token = (process.env.HF_TOKEN || '').trim();
    const model = (req.query.model || 'google/flan-t5-base').trim();

    // 1) cek token
    const who = await fetch('https://huggingface.co/api/whoami-v2', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const whoRaw = await who.text();
    if (!who.ok) {
      return res.status(who.status).json({ step: 'whoami', status: who.status, detail: whoRaw });
    }

    // 2) cek model ada/tidak
    const meta = await fetch(`https://huggingface.co/api/models/${encodeURIComponent(model)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const metaRaw = await meta.text();
    if (!meta.ok) {
      return res.status(meta.status).json({ step: 'model_meta', status: meta.status, detail: metaRaw, model });
    }

    // 3) coba panggil inference (tanpa input berat)
    const inf = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-wait-for-model': 'true'
      },
      body: JSON.stringify({ inputs: 'hello' })
    });
    const infRaw = await inf.text();

    return res.status(inf.status).json({
      step: 'inference',
      status: inf.status,
      detail: tryParse(infRaw),
      model
    });
  } catch (e) {
    return res.status(500).json({ error: 'server_error', detail: e.message });
  }
};

function tryParse(t) { try { return JSON.parse(t); } catch { return t; } }
