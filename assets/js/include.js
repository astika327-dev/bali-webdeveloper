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
