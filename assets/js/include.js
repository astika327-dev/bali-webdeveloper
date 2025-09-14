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

// Slider sederhana
// ===== Project Screenshot Slider =====
class Slider {
  constructor(root){
    this.root = root;
    this.track = root.querySelector('.slides');
    this.slides = Array.from(this.track.children);
    this.prevBtn = root.querySelector('.prev');
    this.nextBtn = root.querySelector('.next');
    this.dotsWrap = root.querySelector('.dots');

    this.index = 0;
    this.len = this.slides.length;
    this.intervalMs = parseInt(root.dataset.interval || '3500', 10);
    this.autoplay = root.dataset.autoplay === 'true';

    // dots
    this.dots = this.slides.map((_,i)=>{
      const b=document.createElement('button');
      b.addEventListener('click',()=>this.go(i,true));
      this.dotsWrap.appendChild(b);
      return b;
    });
    this.update();

    // nav
    this.prevBtn.addEventListener('click',()=>this.prev(true));
    this.nextBtn.addEventListener('click',()=>this.next(true));

    // autoplay + pause on hover
    if (this.autoplay) this.start();
    root.addEventListener('mouseenter',()=>this.stop());
    root.addEventListener('mouseleave',()=>this.start());

    // swipe (touch)
    this.bindSwipe();
  }
  go(i,manual=false){
    this.index = (i+this.len)%this.len;
    this.track.style.transform = `translateX(-${this.index*100}%)`;
    this.update();
    if (manual && this.autoplay){ this.restart(); }
  }
  next(m=false){ this.go(this.index+1,m); }
  prev(m=false){ this.go(this.index-1,m); }
  update(){
    this.dots.forEach((d,i)=>d.classList.toggle('active', i===this.index));
  }
  start(){
    if (this.timer) return;
    this.timer = setInterval(()=>this.next(), this.intervalMs);
  }
  stop(){ clearInterval(this.timer); this.timer=null; }
  restart(){ this.stop(); this.start(); }
  bindSwipe(){
    let x0=null, locked=false;
    const unify = e => (e.changedTouches? e.changedTouches[0]:e);
    this.root.addEventListener('touchstart', e => { x0 = unify(e).clientX; locked=true; }, {passive:true});
    this.root.addEventListener('touchend', e => {
      if (!locked || x0===null) return;
      let dx = unify(e).clientX - x0;
      if (Math.abs(dx) > 40) (dx>0 ? this.prev(true) : this.next(true));
      x0=null; locked=false;
    }, {passive:true});
  }
}
document.querySelectorAll('.slider').forEach(s => new Slider(s));
