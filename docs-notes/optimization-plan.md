# Rencana Optimasi Bali-WebDevelover

Dokumen ini merangkum peluang optimasi dan ide fitur lanjutan berdasarkan audit cepat terhadap repositori ini per Maret 2025.

## 1. Performa & Teknis
- **Kurangi style duplikat**: `assets/css/main.css` mendefinisikan aturan `.nav` dan `.nav__toggle` dua kali dengan pendekatan berbeda (baris 26-56 dan 93-121). Satukan supaya ukuran CSS mengecil dan perilaku mobile lebih konsisten. 【F:assets/css/main.css†L26-L56】【F:assets/css/main.css†L93-L121】
- **Atur strategi pemuatan font**: `index.html` memuat font Google secara sinkron. Tambahkan `rel="preload"`/`font-display:swap` agar teks tidak mengalami FOIT dan mempercepat paint awal. 【F:index.html†L6-L13】
- **Lazy-load aset hero**: gambar hero (`assets/img/homeimage1.png`/`homeimage2.png`) langsung dimuat meskipun besar. Tambah atribut `loading="lazy"` dan ukuran eksplisit untuk mencegah layout shift. 【F:index.html†L44-L55】
- **Caching & bundling JS**: script AI (`assets/js/ai.js`) dan inline fetch di beranda dapat dibundel/minify. Pertimbangkan juga menangani error network (timeout) dan fallback UI.
- **Gunakan meta viewport yang responsif**: viewport sudah ada, tetapi tambahkan `viewport-fit=cover` agar aman di perangkat dengan notch ketika menggunakan CSS `env(safe-area-inset-*)`. 【F:index.html†L5-L13】

## 2. Aksesibilitas
- **Lengkapi interaksi tombol menu**: tombol mobile nav (`#navToggle`) sudah memiliki atribut ARIA, namun `include.js` belum menangani keyboard Escape atau fokus ketika menu dibuka. Tambahkan handler agar menu menutup saat Escape ditekan dan fokus dipindah kembali ke tombol. 【F:index.html†L42-L59】【F:assets/js/include.js†L33-L79】
- **Label AI form**: sudah ada label tersembunyi, namun tombol "Tanya" tidak mengumumkan status loading. Gunakan `aria-live` pada elemen output dan `aria-busy` saat request berjalan. 【F:index.html†L63-L110】
- **Kontras warna**: cek kembali kombinasi warna brand (#8B5E34 dengan teks putih) terhadap WCAG AA untuk teks kecil.

## 3. SEO & Konten
- **Structured Data**: tambahkan JSON-LD `ProfessionalService` dengan data alamat, jam operasional, dan area layanan untuk meningkatkan visibilitas lokal.
- **Blog/Insight Section**: buat halaman artikel untuk menarget keyword long-tail seperti "jasa pembuatan website bali" atau studi kasus klien.
- **Testimonial dinamis**: sertakan review terverifikasi dengan schema `Review` agar rich snippets muncul di SERP.

## 4. Fitur Baru yang Diusulkan
- **Kalkulator estimasi biaya**: form sederhana yang menghasilkan kisaran harga proyek berdasarkan fitur pilihan. Ini menambah interaksi dan lead qualification.
- **Portfolio filterable**: halaman `portfolio.html` dapat diberi filter (kategori industri/tipe proyek) agar calon klien cepat menemukan contoh relevan. 【F:portfolio.html†L1-L120】
- **Live chat WhatsApp floating button**: mempermudah pengunjung menghubungi langsung.
- **Mode gelap**: toggle dark/light untuk menyesuaikan preferensi pengguna dan menambah kesan modern.
- **Testimoni video & before/after**: tingkatkan kepercayaan brand melalui konten multimedia.

## 5. Operasional & Analytics
- **Integrasi CRM/Form handler**: sambungkan form kontak ke alat seperti HubSpot atau Notion API agar leads tidak hilang.
- **Pelacakan konversi**: implementasi `gtag`/Meta Pixel dengan consent banner agar data marketing siap ketika scale.
- **Monitoring uptime**: tambahkan Healthcheck/Status page sederhana bila layanan AI Worker sering berubah.

---

Prioritaskan perubahan yang berdampak cepat pada Core Web Vitals (performa) dan aksesibilitas, lalu lanjutkan ke fitur yang meningkatkan konversi.
