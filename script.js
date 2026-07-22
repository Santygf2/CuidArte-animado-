    document.getElementById('year').textContent = new Date().getFullYear();

    // Navbar scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

    // Nav pill cursor glow
    (function() {
      const pill = document.getElementById('navPill');
      const glow = document.getElementById('navPillGlow');
      if (!pill || !glow) return;
      pill.addEventListener('mousemove', e => {
        const r = pill.getBoundingClientRect();
        glow.style.left = (e.clientX - r.left) + 'px';
        glow.style.top = (e.clientY - r.top) + 'px';
      });
    })();

    // Active section highlight in nav
    (function() {
      const links = document.querySelectorAll('.nav-link-futuristic[data-section]');
      const sectionIds = Array.from(links).map(l => l.dataset.section);
      const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
      if (!sections.length) return;
      const sectionRo = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
          }
        });
      }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
      sections.forEach(s => sectionRo.observe(s));
    })();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function(e) {
        const h = this.getAttribute('href');
        if (h === '#') return;
        e.preventDefault();
        const t = document.querySelector(h);
        if (t) { window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20, behavior: 'smooth' }); }
      });
    });

    // Scroll reveal
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); ro.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => ro.observe(el));

    // Glitch title on scroll
    const glitchRo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('glitch-active');
          setTimeout(() => e.target.classList.remove('glitch-active'), 500);
          glitchRo.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.glitch-title').forEach(el => glitchRo.observe(el));

    // Back to top
    const btt = document.getElementById('backToTop');
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 500));
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Hamburger toggle
    const hamburger = document.getElementById('hamburgerBtn');
    if (hamburger) {
      hamburger.addEventListener('click', () => hamburger.classList.toggle('open'));
      document.querySelectorAll('#mobileNav .offcanvas-link, #mobileNav .offcanvas-cta').forEach(el => {
        el.addEventListener('click', () => hamburger.classList.remove('open'));
      });
    }

    // ========== CINEMATIC INTRO ==========
    window.addEventListener('load', () => {
      document.querySelectorAll('.intro-anim, .intro-anim-left, .intro-anim-right, .intro-anim-scale, .intro-anim-fly-r, .intro-anim-fly-l').forEach(el => {
        el.classList.add('play');
      });
    });

    // ========== CUIDARTE TITLE LETTER ANIMATION ==========
    (function() {
      const word = document.getElementById('cuidarteWord');
      if (!word) return;
      const text = 'CuidArte';
      word.innerHTML = '';
      text.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = ch;
        word.appendChild(span);
      });
      // Add glow line
      const line = document.createElement('span');
      line.className = 'title-glow-line';
      word.appendChild(line);
    })();

    // ========== HERO CANVAS: Particles + Constellation ==========
    (function() {
      const canvas = document.getElementById('heroCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let w, h, particles = [], mouse = { x: null, y: null };
      const isMobile = window.innerWidth < 768;
      const COUNT = isMobile ? 40 : 80;
      const MAX_DIST = isMobile ? 100 : 150;

      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        w = canvas.width = rect.width;
        h = canvas.height = rect.height;
      }
      resize();
      window.addEventListener('resize', resize);

      canvas.parentElement.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

      class Particle {
        constructor() {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.vx = (Math.random() - 0.5) * 0.8;
          this.vy = (Math.random() - 0.5) * 0.8;
          this.r = Math.random() * 2 + 1;
          this.color = Math.random() > 0.7 ? 'rgba(255,107,157,' : 'rgba(255,255,255,';
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > w) this.vx *= -1;
          if (this.y < 0 || this.y > h) this.vy *= -1;
          if (mouse.x !== null) {
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              this.x += dx * 0.02;
              this.y += dy * 0.02;
            }
          }
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fillStyle = this.color + '0.6)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = this.color + '0.08)';
          ctx.fill();
        }
      }

      for (let i = 0; i < COUNT; i++) particles.push(new Particle());

      function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = 'rgba(255,255,255,' + (1 - dist / MAX_DIST) * 0.15 + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        if (mouse.x !== null) {
          particles.forEach(p => {
            const dx = p.x - mouse.x, dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              ctx.beginPath();
              ctx.moveTo(mouse.x, mouse.y);
              ctx.lineTo(p.x, p.y);
              ctx.strokeStyle = 'rgba(255,255,255,' + (1 - dist / 180) * 0.3 + ')';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        }
        requestAnimationFrame(animate);
      }
      animate();
    })();

    // ========== Tilt effect ==========
    if (window.innerWidth > 991) {
      document.querySelectorAll('.especialidad-card').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left, y = e.clientY - r.top;
          const rx = (y - r.height / 2) / 20, ry = (r.width / 2 - x) / 20;
          card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`;
          card.style.setProperty('--mouse-x', (x / r.width * 100) + '%');
          card.style.setProperty('--mouse-y', (y / r.height * 100) + '%');
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
      });
    }

    // ========== Magnetic hover on buttons ==========
    document.querySelectorAll('.btn-hero-primary, .btn-hero-outline, .btn-cta-primary, .btn-cta-outline').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });

    // ========== CTA Particle Burst ==========
    (function() {
      const cta = document.querySelector('.cta-box');
      if (!cta) return;
      const colors = ['#27BEF5','#6DD5FA','#FF6B9D','#ffffff'];
      cta.addEventListener('mouseenter', e => {
        const rect = cta.getBoundingClientRect();
        const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
        for (let i = 0; i < 16; i++) {
          const p = document.createElement('div');
          p.className = 'cta-particle';
          const angle = (Math.PI * 2 / 16) * i;
          const dist = 60 + Math.random() * 80;
          const bx = Math.cos(angle) * dist;
          const by = Math.sin(angle) * dist;
          p.style.cssText = `left:${cx}px;top:${cy}px;background:${colors[i%colors.length]};--bx:${bx}px;--by:${by}px;width:${3+Math.random()*5}px;height:${3+Math.random()*5}px;`;
          cta.appendChild(p);
          requestAnimationFrame(() => { p.style.animation = `particleBurst .7s ease forwards`; });
          setTimeout(() => p.remove(), 800);
        }
      });
    })();

    // ========== FOOTER ANIMATIONS ==========
    (function() {
      const footer = document.getElementById('footerSection');
      if (!footer) return;

      // Footer columns reveal
      const colsRo = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('col-visible');
            colsRo.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      footer.querySelectorAll('.footer-col-reveal').forEach(el => colsRo.observe(el));

      // Footer links stagger
      const linksRo = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('li').forEach((li, i) => {
              setTimeout(() => li.classList.add('link-visible'), i * 60);
            });
            linksRo.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      footer.querySelectorAll('[data-footer-links]').forEach(el => linksRo.observe(el));

      // Social icons pop
      const socialRo = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('a').forEach((a, i) => {
              setTimeout(() => a.classList.add('social-visible'), i * 100 + 200);
            });
            socialRo.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      const socialEl = document.getElementById('footerSocial');
      if (socialEl) socialRo.observe(socialEl);
    })();

    // ========== INTRO FEATURES STAGGER ==========
    (function() {
      const container = document.getElementById('introFeatures');
      if (!container) return;
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            container.querySelectorAll('.feature-hidden').forEach((el, i) => {
              setTimeout(() => {
                el.classList.remove('feature-hidden');
                el.classList.add('feature-revealed');
              }, i * 200);
            });
            ro.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      ro.observe(container);
    })();

    // ========== CTA GLOW ON SCROLL ==========
    (function() {
      const cta = document.getElementById('ctaBox');
      if (!cta) return;
      const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            cta.classList.add('cta-visible');
            ro.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      ro.observe(cta);
    })();

    // ========== FLOATING DOTS IN SECTIONS ==========
    (function() {
      const sections = document.querySelectorAll('.intro-section, .especialidades-section');
      sections.forEach(section => {
        const container = document.createElement('div');
        container.className = 'section-floating-dots';
        for (let i = 0; i < 8; i++) {
          const dot = document.createElement('div');
          dot.className = 'fdot';
          const size = 3 + Math.random() * 4;
          const colors = ['rgba(39,190,245,.3)', 'rgba(255,107,157,.25)', 'rgba(109,213,250,.3)'];
          dot.style.cssText = `width:${size}px;height:${size}px;background:${colors[i%3]};left:${10+Math.random()*80}%;top:${10+Math.random()*80}%;animation-duration:${4+Math.random()*6}s;animation-delay:${Math.random()*4}s;`;
          container.appendChild(dot);
        }
        section.appendChild(container);
      });
    })();

    // ========== Data streams in specialidades ==========
    (function() {
      const section = document.querySelector('.especialidades-section');
      if (!section || window.innerWidth < 768) return;
      for (let i = 0; i < 6; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.left = (Math.random() * 100) + '%';
        stream.style.height = (Math.random() * 60 + 40) + 'px';
        stream.style.animationDuration = (Math.random() * 8 + 6) + 's';
        stream.style.animationDelay = (Math.random() * 5) + 's';
        stream.style.opacity = Math.random() * 0.3 + 0.1;
        section.appendChild(stream);
      }
    })();
