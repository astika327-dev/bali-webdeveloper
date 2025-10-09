# Server Dev Proxy & Contact Form

Backend kecil ini menyediakan dua hal:

1. Proxy untuk OpenAI / OpenRouter (`/api/or`).
2. Endpoint `/contact` untuk menerima form dari website utama dan meneruskannya ke webhook.

## Menjalankan secara lokal

```bash
cd server
npm install
npm start
```

Server akan berjalan di `http://localhost:3001` secara default.

## Konfigurasi Environment

Salin `server/.env.example` menjadi `server/.env` lalu isi nilai yang diperlukan.

### Variabel Kontak (Webhook)

Endpoint kontak meneruskan payload ke layanan eksternal (mis. Notion, Google Sheet, Make/Integromat) melalui HTTP webhook.

| Variabel | Deskripsi |
| --- | --- |
| `CONTACT_WEBHOOK_URL` | URL webhook tujuan. Wajib diisi. |
| `CONTACT_WEBHOOK_KEY` | Opsional. Token/secret yang akan dikirim sebagai header `Authorization: Bearer ...`. |

> 💡 Endpoint akan menolak request bila `CONTACT_WEBHOOK_URL` belum di-set.

### Variabel Lain

- `PORT`: port server Express.
- `OPENAI_API_KEY`: opsional, hanya untuk proxy OpenAI.

## Response Endpoint `/contact`

- **200**: `{ success: true, message: "Thanks! Your message has been sent." }`
- **400**: `{ error: 'invalid_payload', message: '...' }` bila field penting kosong.
- **503**: `{ error: 'webhook_unavailable', message: '...' }` bila webhook belum di-set.
- **500**: `{ error: 'webhook_error', message: '...' }` bila forward ke webhook gagal.

Gunakan endpoint ini dari frontend dengan `fetch` atau AJAX lainnya.
