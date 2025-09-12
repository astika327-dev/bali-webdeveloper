async function includePartials() {
  const slots = document.querySelectorAll('[data-include]');
  for (const el of slots) {
    const file = el.getAttribute('data-include');
    const res = await fetch(file);
    el.innerHTML = await res.text();
  }
  const current = document.body.dataset.page;
  const interval = setInterval(()=>{
    const navLinks = document.querySelectorAll('.nav a[data-page]');
    if(navLinks.length){
      navLinks.forEach(a => { if (a.dataset.page === current) a.classList.add('active'); });
      clearInterval(interval);
    }
  }, 50);
}
includePartials();
// setelah partials ter-inject, aktifkan toggle menu
const hookMobileNav = () => {
  const btn = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
};
const ready = setInterval(() => {
  if (document.getElementById('navToggle')) {
    hookMobileNav();
    clearInterval(ready);
  }
}, 50);

document.addEventListener('click', e=>{
  const m = document.getElementById('navMenu');
  if(!m) return;
  if(e.target.closest('#navMenu a')) { m.classList.remove('is-open'); document.getElementById('navToggle')?.setAttribute('aria-expanded','false'); }
});

// Smooth cross-page transitions
(function smoothNav(){
  const DUR = 380; // ms (ubah kalau mau lebih lambat/cepat)

  // beri efek fade-in saat halaman dibuka
  document.body.classList.add('vt-fade-in');

  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a');
    if (!a) return;

    // Hindari eksternal, target _blank, download, atau hash di halaman sama
    const url = new URL(a.href, location.href);
    const internal = url.origin === location.origin;
    const samePageHash = url.pathname === location.pathname && url.hash;
    const newTab = a.target === '_blank' || a.hasAttribute('download');

    if (!internal || newTab || samePageHash) return;

    e.preventDefault();

    // Browser baru: View Transitions API
    if (document.startViewTransition) {
      document.startViewTransition(() => { location.href = a.href; });
      return;
    }

    // Fallback: CSS fade-out lalu pindah halaman
    document.body.classList.add('vt-fade-out');
    setTimeout(()=>{ location.href = a.href; }, DUR);
  }, true);
})();
