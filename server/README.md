# Backend OpenAI Proxy

Backend ringan berbasis Express untuk meneruskan permintaan dari front-end ke OpenAI API secara aman.

## Persiapan

1. Duplikat file `.env.example` menjadi `.env` dan isi nilai `OPENAI_API_KEY` Anda.
2. Install dependensi dengan menjalankan:

   ```bash
   npm install
   ```

## Menjalankan Secara Lokal

```bash
npm start
```

Server akan berjalan di `http://localhost:3001` secara default.

### Endpoint

- `POST /api/openai`

  Body (JSON):

  ```json
  {
    "prompt": "Tuliskan tagline kreatif",
    "model": "gpt-3.5-turbo",
    "temperature": 0.7
  }
  ```

  Respons:

  ```json
  {
    "success": true,
    "model": "gpt-3.5-turbo",
    "created": 1700000000,
    "message": "Tagline Anda...",
    "usage": { "prompt_tokens": 12, "completion_tokens": 24, "total_tokens": 36 }
  }
  ```

- `GET /health` untuk pengecekan sederhana.

## Deployment

Pastikan environment variable `OPENAI_API_KEY` terset pada platform hosting yang digunakan.
