(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-status');
  if (!form) return;

  const setStatus = (type, message) => {
    if (!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.classList.remove('success', 'error');
    if (type) {
      statusEl.classList.add(type);
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus(null, 'Sending...');

    const formData = new FormData(form);
    const body = new URLSearchParams();
    formData.forEach((value, key) => {
      body.append(key, value.toString().trim());
    });

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: body.toString()
      });

      let data = {};
      try {
        data = await response.json();
      } catch (err) {
        // ignore JSON parse errors
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message. Please try again.');
      }

      setStatus('success', data.message || 'Thanks! Your message has been sent.');
      form.reset();
    } catch (error) {
      setStatus('error', error.message || 'Something went wrong.');
    }
  });
})();
