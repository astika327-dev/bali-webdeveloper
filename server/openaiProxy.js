const axios = require('axios');

const MAX_PROMPT_LENGTH = 2000;
const DISALLOWED_PATTERN = /<\/?script\b/i;
const OPENAI_CHAT_COMPLETIONS_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Validate the prompt and other inputs coming from the client.
 * @param {string} prompt
 * @throws {Error} when validation fails
 */
function validatePrompt(prompt) {
  if (typeof prompt !== 'string') {
    throw new Error('Prompt harus berupa teks.');
  }

  const trimmedPrompt = prompt.trim();

  if (!trimmedPrompt) {
    throw new Error('Prompt tidak boleh kosong.');
  }

  if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
    throw new Error(`Prompt terlalu panjang (maksimal ${MAX_PROMPT_LENGTH} karakter).`);
  }

  if (DISALLOWED_PATTERN.test(trimmedPrompt)) {
    throw new Error('Prompt mengandung konten yang tidak diizinkan.');
  }

  return trimmedPrompt;
}

/**
 * Express handler that proxies requests to the OpenAI API.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
module.exports = async function openaiProxy(req, res) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'Konfigurasi server belum lengkap. OPENAI_API_KEY belum diset.',
      });
    }

    const { prompt, model = 'gpt-3.5-turbo', temperature = 0.7 } = req.body || {};

    const sanitizedPrompt = validatePrompt(prompt);

    const response = await axios.post(
      OPENAI_CHAT_COMPLETIONS_URL,
      {
        model,
        messages: [
          {
            role: 'user',
            content: sanitizedPrompt,
          },
        ],
        temperature,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000,
      }
    );

    const message =
      response?.data?.choices?.[0]?.message?.content || 'Tidak ada respons dari model.';

    return res.json({
      success: true,
      model: response?.data?.model,
      created: response?.data?.created,
      message,
      usage: response?.data?.usage,
    });
  } catch (error) {
    const status = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error?.message || error.message || 'Terjadi kesalahan tak terduga.';

    return res.status(status).json({
      success: false,
      error: errorMessage,
    });
  }
};
