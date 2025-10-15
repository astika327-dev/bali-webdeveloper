/* assets/js/ai.js — enterprise-lite chat widget without tears */
(() => {
  const API = 'https://long-sunset-5416.baliwebdevelover.workers.dev/api/or';
  const LSKEY = 'aiw:history:v1';
  const TIMEOUT_MS = 45000;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const el = {
    wrap: $('#aiw'),
    chat: $('#aiw-chat'),
    form: $('#aiw-form'),
    input: $('#aiw-input'),
    send: $('#aiw-send'),
    model: $('#aiw-model'),
    hint: $('#aiw-hint'),
    clear: $('#aiw-clear'),
    sys: $('#aiw-system'),
  };
  if (!el.wrap) return; // page tanpa widget

  // ---------- History state ----------
  let history = loadHistory();
  renderFromHistory();

  function loadHistory() {
    try {
      const raw = localStorage.getItem(LSKEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (_) { return []; }
  }
  function saveHistory() {
    try { localStorage.setItem(LSKEY, JSON.stringify(history.slice(-60))); } catch (_) {}
  }

  // ---------- UI helpers ----------
  function scrollToEnd() {
    el.chat.scrollTop = el.chat.scrollHeight;
  }
  function setBusy(b) {
    el.wrap.setAttribute('aria-busy', String(b));
    el.send.disabled = b;
  }
  function bubble(role, text, meta) {
    const item = document.createElement('div');
    item.className = `aiw-msg ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'aiw-avatar';
    avatar.textContent = role === 'user' ? '🧑' : role === 'assistant' ? '🤖' : 'ℹ️';
    const bubble = document.createElement('div');
    bubble.className = 'aiw-bubble';
    bubble.textContent = text;
    item.appendChild(avatar);
    item.appendChild(bubble);

    if (role === 'assistant') {
      const bar = document.createElement('div');
      bar.className = 'aiw-toolbar';
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.textContent = 'Copy';
      copyBtn.onclick = () => navigator.clipboard.writeText(bubble.textContent || '');
      const retryBtn = document.createElement('button');
      retryBtn.type = 'button';
      retryBtn.textContent = 'Retry';
      retryBtn.onclick = () => {
        // retry last user message with same system/model
        const lastUser = [...history].reverse().find(m => m.role === 'user');
        if (lastUser) promptSend(lastUser.content, true);
      };
      bar.append(copyBtn, retryBtn);
      if (meta?.usage || meta?.latencyMs) {
        const badge = document.createElement('span');
        badge.className = 'aiw-badge';
        const toks = meta.usage ? `tok ${meta.usage.input||0}/${meta.usage.output||0}` : '';
        const lat = meta.latencyMs ? ` • ${Math.round(meta.latencyMs)}ms` : '';
        badge.textContent = `${toks}${lat}`;
        bar.appendChild(badge);
      }
      item.appendChild(bar);
    }

    el.chat.appendChild(item);
    scrollToEnd();
    return bubble;
  }

  // typing indicator
  let typingBubble = null;
  function showTyping() {
    typingBubble = bubble('assistant', 'Mengetik');
    const span = document.createElement('span');
    span.className = 'aiw-typing';
    span.textContent = '…';
    typingBubble.textContent = 'Mengetik ';
    typingBubble.appendChild(span);
  }
  function hideTyping() {
    if (typingBubble) {
      typingBubble.parentElement?.remove();
      typingBubble = null;
    }
  }

  // ---------- Render initial ----------
  function renderFromHistory() {
    el.chat.innerHTML = '';
    history.forEach(m => bubble(m.role, m.content));
    scrollToEnd();
  }

  // ---------- Form handlers ----------
  autosizeTextarea(el.input);
  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = (el.input.value || '').trim();
    if (!text) return;
    promptSend(text);
  });
  el.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      el.form.requestSubmit();
    }
  });
  el.clear.addEventListener('click', () => {
    history = [];
    saveHistory();
    renderFromHistory();
    el.input.focus();
  });

  // ---------- Core send ----------
  async function promptSend(text, isRetry = false) {
    const model = el.model.value;
    const sys = (el.sys.value || '').trim();
    const userMsg = { role: 'user', content: text };
    if (!isRetry) {
      history.push(userMsg);
      saveHistory();
    }
    bubble('user', text);
    showTyping();
    setBusy(true);

    let startedAt = performance.now();
    const aborter = new AbortController();
    const timer = setTimeout(() => aborter.abort(new DOMException('Timeout', 'TimeoutError')), TIMEOUT_MS);

    try {
      // Prefer JSON POST with your current Worker API shape.
      const payload = buildPayload(history, model, sys);
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: aborter.signal
      });

      clearTimeout(timer);

      const ctype = res.headers.get('content-type') || '';
      let assistantText = '';

      if (ctype.includes('text/event-stream')) {
        // SSE streaming (future-proof): progressively append
        assistantText = await streamSSE(res, startedAt);
      } else if (ctype.includes('application/json')) {
        const txt = await res.text(); // tolerate invalid JSON with trace
        let data;
        try { data = JSON.parse(txt); } catch {
          throw new Error(`Non-parseable JSON: ${txt.slice(0, 140)}`);
        }
        if (!res.ok) {
          const err = data.error || data.detail || `HTTP ${res.status}`;
          throw new Error(err);
        }
        assistantText =
          data.output ||
          data.message?.content ||
          data.choices?.[0]?.message?.content ||
          data.response ||
          data.text ||
          '';

        if (!assistantText) {
          assistantText = '(tidak ada konten)';
        }

        hideTyping();
        const meta = {
          usage: data.usage,
          latencyMs: performance.now() - startedAt
        };
        history.push({ role: 'assistant', content: assistantText });
        bubble('assistant', assistantText, meta);
        saveHistory();

      } else {
        // plain text fallback
        const plain = await res.text();
        if (!res.ok) throw new Error(plain || `HTTP ${res.status}`);
        assistantText = plain || '';
        hideTyping();
        history.push({ role: 'assistant', content: assistantText });
        bubble('assistant', assistantText, { latencyMs: performance.now() - startedAt });
        saveHistory();
      }

    } catch (err) {
      clearTimeout(timer);
      hideTyping();
      const msg = normalizeErr(err);
      bubble('meta', `⚠️ ${msg}`);
    } finally {
      setBusy(false);
      el.input.value = '';
      autosizeTextarea(el.input);
      el.input.focus();
    }
  }

  function buildPayload(history, model, sys) {
    // Worker kamu saat ini menerima {prompt, model}. Kita gabungkan history agar tetap kompatibel.
    const joined = history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const prompt = (sys ? `System: ${sys}\n\n` : '') + joined + '\nAssistant:';
    return { prompt, model };
  }

  function normalizeErr(e) {
    if (e?.name === 'AbortError' || e?.name === 'TimeoutError') return 'Request timeout. Server lambat atau menolak realita.';
    const s = String(e?.message || e);
    if (s.match(/api key/i)) return 'API key/konfigurasi server bermasalah.';
    return s;
  }

  async function streamSSE(res, startedAt) {
    // Kalau nanti backend ngasih SSE, ini siap dipakai.
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    hideTyping();
    const bbl = bubble('assistant', '');
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = dec.decode(value, { stream: true });
      // sangat minimal: cari "data: ..." per baris
      chunk.split('\n').forEach(line => {
        const m = line.match(/^data:\s*(.*)$/);
        if (!m) return;
        try {
          const obj = JSON.parse(m[1]);
          const delta = obj.delta || obj.text || obj.choices?.[0]?.delta?.content || '';
          if (delta) {
            text += delta;
            bbl.textContent = text;
          }
        } catch { /* ignore */ }
      });
    }
    history.push({ role: 'assistant', content: text || '(kosong)' });
    saveHistory();
    return text;
  }

  function autosizeTextarea(t) {
    const resize = () => {
      t.style.height = 'auto';
      t.style.height = Math.min(t.scrollHeight, 200) + 'px';
    };
    t.addEventListener('input', resize);
    resize();
  }
})();
