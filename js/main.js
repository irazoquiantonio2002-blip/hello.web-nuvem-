(() => {
  'use strict';

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 500);
  });

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mob-menu');
  if (hamburger && mobMenu) {
    const closeMenu = () => {
      hamburger.setAttribute('aria-expanded', 'false');
      mobMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    hamburger.addEventListener('click', () => {
      const isOpen = mobMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Marquee content ---------- */
  const marquee = document.getElementById('marquee');
  if (marquee) {
    const items = [
      'Agua Purificada', 'Ósmosis Inversa', '6 Etapas de Filtración',
      'Garrafones de 20L', 'Botella Individual', 'Región Veracruz',
      'Tecnología Certificada', 'De la Naturaleza a tu Hogar'
    ];
    const buildSet = () => items.map(txt =>
      `<span class="marquee-item"><i class="fa-solid fa-droplet"></i>${txt}</span>`
    ).join('');
    marquee.innerHTML = buildSet() + buildSet();
  }

  /* ---------- Stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count || '0');
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(target * eased);
      el.textContent = prefix + value.toLocaleString('es-MX') + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (statEls.length && 'IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(el => statIo.observe(el));
  }

  /* ---------- Hero canvas — burbujas de agua ---------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w, h, bubbles;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const hero = document.getElementById('hero');
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const initBubbles = () => {
      const count = window.innerWidth < 700 ? 22 : 42;
      bubbles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: h + Math.random() * h,
        r: 1.5 + Math.random() * 3.5,
        speed: 0.25 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 0.4,
        alpha: 0.15 + Math.random() * 0.35,
        hue: Math.random() > 0.7 ? 'gold' : 'blue'
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      bubbles.forEach(b => {
        b.y -= b.speed;
        b.x += b.drift;
        if (b.y < -10) { b.y = h + 10; b.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.hue === 'gold'
          ? `rgba(232,205,122,${b.alpha})`
          : `rgba(127,179,217,${b.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    resize();
    initBubbles();
    draw();
    window.addEventListener('resize', () => { resize(); initBubbles(); }, { passive: true });
  }

  /* ---------- Contact form → WhatsApp ---------- */
  const WA_NUMBER = '522381503429';
  const form = document.getElementById('wa-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('f-name').value.trim();
      const interest = document.getElementById('f-interest').value;
      const msg = document.getElementById('f-msg').value.trim();

      if (!name || !msg) {
        form.reportValidity();
        return;
      }

      const text =
        `Hola, soy ${name}. ` +
        `Me interesa: ${interest}. ` +
        `Detalle: ${msg}`;

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }
})();
