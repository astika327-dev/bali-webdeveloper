# 🌐 Bali-WebDevelover

**Bali-WebDevelover** adalah website resmi jasa pembuatan website profesional yang berbasis di Bali.  
Website ini menampilkan layanan, portfolio, dan kontak untuk calon klien yang ingin membuat website modern, responsif, dan sesuai kebutuhan bisnis.

---

## 🚀 Tech Stack
- **HTML5**, **CSS3**, **JavaScript (Vanilla)**
- **Responsive Design** (desktop & mobile)
- **Cloudflare Pages / GitHub Pages** untuk deployment
- **Free AI Widget (Grok)** untuk demo integrasi AI chat di website

---

## 📂 Struktur Project
├── index.html # Halaman utama (Home)
├── services.html # Layanan
├── portfolio.html # Portfolio project
├── contact.html # Kontak
├── assets/
│ ├── css/
│ │ └── main.css # Styling global
│ ├── js/
│ │ └── include.js # Script interaktif
│ └── img/ # Logo, icon, dan gambar
├── docs-notes/
│ └── optimization-plan.md # Catatan internal optimasi (tidak dipublikasi)
└── README.md

---

## 🚢 Deployment

- Situs adalah HTML statis murni, sehingga dapat di-host di **GitHub Pages**, **Cloudflare Pages**, ataupun **Vercel** tanpa konfigurasi build khusus.
- Pastikan semua file berada di root (tidak ada proses include dinamis); setiap halaman kini sudah memuat header & footer langsung sehingga tidak ada permintaan `fetch` tambahan saat load.
- Setelah deploy, bersihkan cache CDN bila sebelumnya memakai partial dinamis agar versi baru segera aktif.

---

## ✨ Fitur Utama
- ✅ Tampilan modern & elegan (warna coklat pastel khas brand)  
- ✅ Navigasi sticky + mobile friendly  
- ✅ Portfolio project dengan showcase GitHub/FreeCodeCamp  
- ✅ Integrasi **AI Chat (Grok free)** sebagai demo teknologi AI  
- ✅ SEO basic: meta title, description, favicon, dan OG tags  
- ✅ Footer profesional dengan link sosial media

---

## 🗒️ Dokumentasi Internal

- Rencana optimasi performa & fitur: [`docs-notes/optimization-plan.md`](docs-notes/optimization-plan.md)

Catatan internal disimpan terpisah dari direktori `docs/` bawaan GitHub Pages untuk memastikan domain produksi tetap melayani halaman utama tanpa konflik konfigurasi.

---

📝 Lisensi

Project ini dibuat untuk tujuan komersial jasa pembuatan website.
Hak cipta © 2025 Bali-WebDevelover.
