(() => {
  document.addEventListener("DOMContentLoaded", () => {
    // ganti ke URL backend public saat deploy (Render/Heroku)
    const API_BASE =
      (location.hostname === "localhost" || location.hostname === "127.0.0.1")
        ? "http://localhost:3001"
        : "https://YOUR-BACKEND-URL";

    const form   = document.getElementById("ai-form");
    const input  = document.getElementById("ai-input");
    const output = document.getElementById("ai-output");
    const status = document.getElementById("ai-status");
    const send   = document.getElementById("ai-send");

    // submit tanpa reload
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const prompt = (input.value || "").trim();
      if (!prompt) return;

      send.disabled = true;
      status.textContent = "Memproses…";
      output.textContent = "";

      try {
        const res = await fetch(`${API_BASE}/api/openai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt })
        });

        let data = {};
        try { data = await res.json(); } catch {}
        if (!res.ok) {
          const msg = data?.error || `HTTP ${res.status}`;
          throw new Error(msg);
        }

        // fleksibel: ambil field yang ada dari backend
        const reply =
          data.reply ??
          data.message ??
          data.content ??
          data.choices?.[0]?.message?.content ??
          JSON.stringify(data, null, 2);

        output.textContent = reply || "(kosong)";
      } catch (err) {
        output.textContent = "❌ " + (err.message || err);
        console.error(err);
      } finally {
        send.disabled = false;
        status.textContent = "";
      }
    });

    // Enter = kirim, Shift+Enter = baris baru
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
  });
})();
