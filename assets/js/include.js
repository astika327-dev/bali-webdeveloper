// ===== Helper: fetch partials dengan error handling =====
async function includePartials() {
  const slots = document.querySelectorAll('[data-include]');
  if (!slots.length) return;

  const tasks = [...slots].map(async (el) => {
    const file = el.getAttribute('data-include');
    if (!file) return;
    try {
      const res = await fetch(file, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error('[includePartials] Gagal memuat', file, err);
      el.innerHTML = `<div class="include-error" role="alert">Failed to load: ${file}</div>`;
    }
  });

  await Promise.all(tasks);
  document.dispatchEvent(new CustomEvent('partials:ready'));
}

// ===== Helper: isi tahun berjalan di footer =====
function updateFooterYear() {
  const yearEl = document.getElementById('y');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ===== Aktifkan link nav sesuai halaman =====
function setActiveNav() {
  const current = document.body?.dataset?.page || '';
  const navLinks = document.querySelectorAll('.nav a[data-page]');
  navLinks.forEach((a) => {
    a.classList.toggle('active', a.dataset.page === current);
    if (a.classList.contains('active')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ===== Mobile nav toggle =====
function hookMobileNav() {
  const btn = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  const close = () => {
    menu.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    menu.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
  };

  btn.addEventListener('click', () => {
    const willOpen = !menu.classList.contains('is-open');
    willOpen ? open() : close();
  });

  // klik link di dalam menu -> tutup
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });

  // klik di luar menu -> tutup
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      close();
    }
  });
}

// ===== Smooth cross-page transitions (dengan fallback) =====
(function smoothNav() {
  const DUR = 380; // ms

  // efek fade-in saat load
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('vt-fade-in');
  });

  document.addEventListener(
    'click',
    (e) => {
      const a = e.target.closest('a');
      if (!a) return;

      // Abaikan jika:
      // - modifier key (Ctrl/Cmd/Alt/Shift) atau middle-click
      // - target _blank / download
      // - link eksternal
      // - hash navigasi di halaman yang sama
      if (
        e.defaultPrevented ||
        e.button === 1 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        a.target === '_blank' ||
        a.hasAttribute('download')
      )
        return;

      const url = new URL(a.getAttribute('href'), location.href);
      const internal = url.origin === location.origin;
      const samePageHash = url.pathname === location.pathname && !!url.hash;
      if (!internal || samePageHash) return;

      e.preventDefault();

      // View Transitions API (jika ada)
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          location.href = url.href;
        });
        return;
      }

      // Fallback: fade-out lalu pindah halaman
      document.body.classList.add('vt-fade-out');
      setTimeout(() => {
        location.href = url.href;
      }, DUR);
    },
    true
  );
})();

// ===== Slider sederhana =====
class Slider {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector('.slides');
    this.slides = Array.from(this.track?.children || []);
    this.prevBtn = root.querySelector('.prev');
    this.nextBtn = root.querySelector('.next');
    this.dotsWrap = root.querySelector('.dots');

    this.index = 0;
    this.len = this.slides.length;
    this.intervalMs = parseInt(root.dataset.interval || '3500', 10);
    this.autoplay = root.dataset.autoplay === 'true';

    if (!this.track || !this.len) return;

    // build dots
    this.dots = this.slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Slide ${i + 1}`);
      b.addEventListener('click', () => this.go(i, true));
      this.dotsWrap?.appendChild(b);
      return b;
    });

    this.update();

    // nav
    this.prevBtn?.addEventListener('click', () => this.prev(true));
    this.nextBtn?.addEventListener('click', () => this.next(true));

    // autoplay + pause on hover
    if (this.autoplay) this.start();
    this.root.addEventListener('mouseenter', () => this.stop());
    this.root.addEventListener('mouseleave', () => this.start());

    // swipe (touch)
    this.bindSwipe();
  }

  go(i, manual = false) {
    this.index = (i + this.len) % this.len;
    this.track.style.transform = `translateX(-${this.index * 100}%)`;
    this.update();
    if (manual && this.autoplay) this.restart();
  }
  next(m = false) {
    this.go(this.index + 1, m);
  }
  prev(m = false) {
    this.go(this.index - 1, m);
  }
  update() {
    this.dots?.forEach((d, i) => d.classList.toggle('active', i === this.index));
  }
  start() {
    if (this.timer || !this.autoplay) return;
    this.timer = setInterval(() => this.next(), this.intervalMs);
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  restart() {
    this.stop();
    this.start();
  }
  bindSwipe() {
    let x0 = null;
    let locked = false;
    const unify = (e) => (e.changedTouches ? e.changedTouches[0] : e);

    this.root.addEventListener(
      'touchstart',
      (e) => {
        x0 = unify(e).clientX;
        locked = true;
      },
      { passive: true }
    );

    this.root.addEventListener(
      'touchend',
      (e) => {
        if (!locked || x0 === null) return;
        const dx = unify(e).clientX - x0;
        if (Math.abs(dx) > 40) (dx > 0 ? this.prev(true) : this.next(true));
        x0 = null;
        locked = false;
      },
      { passive: true }
    );
  }
}

// ===== Init sequence =====
(async function init() {
  await includePartials();             // 1) inject partials dulu
  updateFooterYear();                  // 1b) isi tahun setelah partial siap
  setActiveNav();                      // 2) highlight nav
  hookMobileNav();                     // 3) aktifkan mobile menu
  // 4) inisialisasi slider (baik di DOM utama maupun yang datang dari partial)
  document.querySelectorAll('.slider').forEach((s) => new Slider(s));

  // Jika nantinya ada partial tambahan yang disuntik setelah page load:
  document.addEventListener('partials:ready', () => {
    setActiveNav();
    hookMobileNav();
    updateFooterYear();
    document.querySelectorAll('.slider').forEach((s) => {
      if (!s.__inited) {
        new Slider(s);
        s.__inited = true;
      }
    });
  });
})();



