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
│ │ └── main.js # Script interaktif
│ └── img/ # Logo, icon, dan gambar
└── README.md

---

## ✨ Fitur Utama
- ✅ Tampilan modern & elegan (warna coklat pastel khas brand)
- ✅ Navigasi sticky + mobile friendly
- ✅ Portfolio project dengan showcase GitHub/FreeCodeCamp
- ✅ Integrasi **AI Chat (Grok free)** sebagai demo teknologi AI
- ✅ SEO basic: meta title, description, favicon, dan OG tags
- ✅ Footer profesional dengan link sosial media

---

## 🛠️ Mengelola Konten

- Seluruh teks dinamis untuk layanan, add-ons, FAQ, portfolio, dan sertifikasi tersentral di **`server/data/site-content.js`**.
- Saat membutuhkan perubahan konten, update nilai di file tersebut; data akan diteruskan otomatis ke template server-side melalui `res.render` dan juga tersedia sebagai JSON read-only di endpoint `GET /api/content`.
- Pastikan struktur objek dipertahankan (misal `services.plans`, `services.addons`, `faq`, `portfolio`, `certifications`) agar loop template `{% for plan in services.plans %}` tetap berjalan.

---

📝 Lisensi

Project ini dibuat untuk tujuan komersial jasa pembuatan website.
Hak cipta © 2025 Bali-WebDevelover.
