const express = require('express');
const cors = require('cors');

const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

const fetch = global.fetch
  ? (...args) => global.fetch(...args)
  : (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'njk');
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production'
});

app.use(cors());
app.use(express.json());

// Inject default template context untuk semua render()
app.use((req, res, next) => {
  const originalRender = res.render.bind(res);

  res.render = (view, options = {}, callback) => {
    const context = {
      siteContent,
      services: siteContent.services,
      faq: siteContent.faq,
      portfolio: siteContent.portfolio,
      certifications: siteContent.certifications,
      ...options
    };
    return originalRender(view, context, callback);
  };

  next();
});

// Static assets (harus setelah middleware di atas, sebelum routes)
const assetsDir = path.resolve(__dirname, '..', 'assets');
app.use('/assets', express.static(assetsDir));

// Root files (opsional, kalau ada)
['favicon.ico', 'site.webmanifest'].forEach((file) => {
  const filePath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    app.get(`/${file}`, (req, res) => {
      res.sendFile(filePath);
    });
  }
});

const baseUrl = process.env.SITE_BASE_URL || 'https://bali-webdevelover.com';
const ogImage = 'https://bali-webdevelover.com/assets/img/logos/ogimg.png';

// Daftar halaman + meta
const pages = [
  {
    path: '/',
    view: 'index',
    page: 'home',
    title: 'Bali WebDevelover – Professional Website Services',
    description: 'Kami membantu bisnis Anda tampil profesional di dunia digital dengan website modern, cepat, dan elegan.',
    twitterDescription: 'Website modern, cepat, dan elegan untuk bisnis Anda.',
    canonical: baseUrl
  },
  {
    path: '/services',
    view: 'services',
    page: 'services',
    title: 'Services — Bali WebDevelover',
    description: 'Paket website yang dibuat untuk founders, villa, café, dan brand berkembang dengan fokus pada performa dan konversi.',
    canonical: `${baseUrl}/services`
  },
  {
    path: '/portfolio',
    view: 'portfolio',
    page: 'portfolio',
    title: 'Portfolio — Bali WebDevelover',
    description: 'Contoh proyek website cepat, elegan, dan fungsional yang telah kami bangun untuk klien.',
    canonical: `${baseUrl}/portfolio`
  },
  {
    path: '/about',
    view: 'about',
    page: 'about',
    title: 'About — Bali WebDevelover',
    description: 'Studio web boutique dari Bali yang mengutamakan detail, performa, dan desain yang tenang.',
    canonical: `${baseUrl}/about`
  },
  {
    path: '/contact',
    view: 'contact',
    page: 'contact',
    title: 'Contact — Bali WebDevelover',
    description: 'Hubungi kami untuk memulai proyek website baru atau konsultasi performa situs Anda.',
    canonical: `${baseUrl}/contact`
  },
  {
    path: '/terms',
    view: 'terms',
    page: 'terms',
    title: 'Terms & Conditions — Bali WebDevelover',
    description: 'Ketentuan layanan untuk project website bersama Bali WebDevelover.',
    canonical: `${baseUrl}/terms`
  },
  {
    path: '/privacy',
    view: 'privacy',
    page: 'privacy',
    title: 'Privacy Policy — Bali WebDevelover',
    description: 'Kebijakan privasi terkait data yang dikumpulkan melalui Bali WebDevelover.',
    canonical: `${baseUrl}/privacy`
  }
];

// Routes render pakai context + OG image
pages.forEach((pageConfig) => {
  app.get(pageConfig.path, (req, res) => {
    res.render(pageConfig.view, { ...pageConfig, ogImage });
  });
});


app.post('/api/or', async (req, res) => {
  try {
    const r = await fetch("https://<nama-worker>.workers.dev/api/or", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(500).json({ error: "proxy_error", detail: e.message });
  }
});

app.get('/api/content', (req, res) => {
  res.json(siteContent);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => {
  res.status(404).render('404', {
    page: '404',
    title: '404 — Page Not Found',
    description: 'Halaman yang Anda cari tidak ditemukan.',
    canonical: `${baseUrl}${req.path}`,
    ogImage
  });
});

app.listen(PORT, () => {
  console.log(`Dev proxy berjalan di http://localhost:${PORT}`);
});
