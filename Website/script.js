/* ==========================================================================
   PIXEL — script.js
   Everything on this page is wired up and functional client-side.
   Replace the CLIPS data (video src) with your real clips before deploying.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Data — swap `src` for your real clip files / hosted URLs           */
  /* ------------------------------------------------------------------ */
  const CLIPS = [
    {
      id: 'c1',
      title: '1v3 clutch on match point',
      category: 'clutch',
      duration: '0:42',
      pattern: 'linear-gradient(135deg, #1a2420, #101114)',
      desc: 'Last round, no utility left, somehow still standing.',
      src: ''
    },
    {
      id: 'c2',
      title: 'That one time I fell off the map',
      category: 'funny',
      duration: '0:18',
      pattern: 'linear-gradient(135deg, #241a1a, #101114)',
      desc: 'Confidence: high. Map awareness: none.',
      src: ''
    },
    {
      id: 'c3',
      title: 'Season montage — episode 1',
      category: 'montage',
      duration: '2:14',
      pattern: 'linear-gradient(135deg, #1a1e24, #101114)',
      desc: 'Three months of clips cut down to the good parts.',
      src: ''
    },
    {
      id: 'c4',
      title: 'Ace on defuse, no scope',
      category: 'clutch',
      duration: '0:35',
      pattern: 'linear-gradient(135deg, #1a2420, #101114)',
      desc: 'Muscle memory carried this one, not skill.',
      src: ''
    },
    {
      id: 'c5',
      title: 'Teammate rage-quits mid clutch',
      category: 'funny',
      duration: '0:27',
      pattern: 'linear-gradient(135deg, #241a1a, #101114)',
      desc: 'Chat did not take it well either.',
      src: ''
    },
    {
      id: 'c6',
      title: 'Best plays — this month',
      category: 'montage',
      duration: '1:48',
      pattern: 'linear-gradient(135deg, #1a1e24, #101114)',
      desc: 'A tighter edit, mostly headshots.',
      src: ''
    }
  ];

  /* ------------------------------------------------------------------ */
  /* Utilities                                                          */
  /* ------------------------------------------------------------------ */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function showToast(message, ms) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('is-visible'), ms || 2600);
  }

  /* ------------------------------------------------------------------ */
  /* Footer year                                                        */
  /* ------------------------------------------------------------------ */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Mobile nav toggle                                                  */
  /* ------------------------------------------------------------------ */
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  function closeMenu() {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    $$('.nav__link').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Smooth scroll for in-page links (accounts for fixed nav height)    */
  /* ------------------------------------------------------------------ */
  $$('[data-scroll], .nav__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

  $('#scrollCue') && $('#scrollCue').addEventListener('click', () => {
    const target = $('#clips');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  $('#backTop') && $('#backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------ */
  /* Active nav link + scroll progress bar                              */
  /* ------------------------------------------------------------------ */
  const sections = $$('.section');
  const navLinkEls = $$('.nav__link');
  const progressFill = $('#progressFill');

  function onScroll() {
    // progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';

    // active section (offset for nav height)
    let current = sections[0] && sections[0].id;
    const navH = 90;
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - navH) current = sec.id;
    });
    navLinkEls.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ */
  /* Scroll reveal animations                                           */
  /* ------------------------------------------------------------------ */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------ */
  /* Hero metallic sheen — follows the pointer                          */
  /* ------------------------------------------------------------------ */
  const sheen = $('#sheen');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (sheen && !isTouch) {
    window.addEventListener('pointermove', (e) => {
      sheen.style.setProperty('--mx', e.clientX + 'px');
      sheen.style.setProperty('--my', e.clientY + 'px');
      sheen.classList.add('is-active');
      clearTimeout(sheen._t);
      sheen._t = setTimeout(() => sheen.classList.remove('is-active'), 1200);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------ */
  /* Clip gallery — render, filter, modal playback                      */
  /* ------------------------------------------------------------------ */
  const clipGrid = $('#clipGrid');

  function clipCardHTML(clip) {
    return `
      <article class="clip-card" data-id="${clip.id}" data-category="${clip.category}" tabindex="0" role="button" aria-label="Play clip: ${clip.title}">
        <div class="clip-card__thumb" style="--pattern:${clip.pattern}">
          <span class="clip-card__tag">${clip.category}</span>
          <button class="clip-card__play" tabindex="-1" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l10-5.5z"/></svg>
          </button>
          <span class="clip-card__dur">${clip.duration}</span>
        </div>
        <div class="clip-card__body">
          <p class="clip-card__title">${clip.title}</p>
          <p class="clip-card__meta mono">${clip.duration} · ${clip.category}</p>
        </div>
      </article>`;
  }

  if (clipGrid) {
    clipGrid.innerHTML = CLIPS.map(clipCardHTML).join('');

    function openClip(id) {
      const clip = CLIPS.find((c) => c.id === id);
      if (!clip) return;
      const modal = $('#clipModal');
      const video = $('#modalVideo');
      $('#modalTitle').textContent = clip.title;
      $('#modalDesc').textContent = clip.desc;

      if (clip.src) {
        video.src = clip.src;
        video.style.display = '';
      } else {
        // No source wired up yet — swap `src` in the CLIPS array to enable playback.
        video.removeAttribute('src');
        video.style.display = 'none';
        showToast('No video source set for this clip yet');
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      $('#modalClose').focus();
    }

    clipGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.clip-card');
      if (card) openClip(card.dataset.id);
    });
    clipGrid.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.clip-card');
      if (card) { e.preventDefault(); openClip(card.dataset.id); }
    });
  }

  // filters
  $$('.clip-filter').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.clip-filter').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      $$('.clip-card').forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ------------------------------------------------------------------ */
  /* Modal close                                                        */
  /* ------------------------------------------------------------------ */
  const modal = $('#clipModal');
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    const video = $('#modalVideo');
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
  if (modal) {
    $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
    $('#modalClose').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Contact form — client-side validation + simulated send             */
  /* ------------------------------------------------------------------ */
  const form = $('#contactForm');
  if (form) {
    const nameInput = $('#name');
    const emailInput = $('#email');
    const messageInput = $('#message');
    const submitBtn = $('#submitBtn');
    const statusEl = $('#formStatus');

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, errorEl, msg) {
      input.classList.toggle('is-invalid', Boolean(msg));
      errorEl.textContent = msg || '';
    }

    function validate() {
      let valid = true;

      if (!nameInput.value.trim()) {
        setError(nameInput, $('#nameError'), 'Please enter your name.');
        valid = false;
      } else {
        setError(nameInput, $('#nameError'), '');
      }

      if (!emailInput.value.trim() || !EMAIL_RE.test(emailInput.value.trim())) {
        setError(emailInput, $('#emailError'), 'Enter a valid email address.');
        valid = false;
      } else {
        setError(emailInput, $('#emailError'), '');
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setError(messageInput, $('#messageError'), 'Message should be at least 10 characters.');
        valid = false;
      } else {
        setError(messageInput, $('#messageError'), '');
      }

      return valid;
    }

    [nameInput, emailInput, messageInput].forEach((input) => {
      input.addEventListener('blur', validate);
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validate();
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      statusEl.classList.remove('is-error');

      if (!validate()) {
        statusEl.textContent = 'Please fix the highlighted fields.';
        statusEl.classList.add('is-error');
        return;
      }

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      statusEl.textContent = '';

      // No backend wired up: this simulates a send, then falls back to
      // opening the visitor's mail client with the message pre-filled.
      // Swap this block for a real fetch() call to your API / form service.
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;

        const subject = encodeURIComponent('New message from ' + nameInput.value.trim());
        const body = encodeURIComponent(
          messageInput.value.trim() + '\n\n— ' + nameInput.value.trim() + ' (' + emailInput.value.trim() + ')'
        );
        const mailLink = document.createElement('a');
        mailLink.href = `mailto:hello@pixel.dev?subject=${subject}&body=${body}`;
        mailLink.click();

        statusEl.textContent = 'Message ready — check your email client to send it.';
        showToast('Opening your email client…');
        form.reset();
      }, 900);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Copy email to clipboard                                            */
  /* ------------------------------------------------------------------ */
  const emailCopy = $('#emailCopy');
  if (emailCopy) {
    emailCopy.addEventListener('click', (e) => {
      const address = 'hello@pixel.dev';
      if (navigator.clipboard && window.isSecureContext) {
        e.preventDefault();
        navigator.clipboard.writeText(address).then(() => {
          showToast('Email copied to clipboard');
        }).catch(() => {
          // clipboard failed — let the default mailto: behaviour proceed
        });
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Social placeholders — friendly nudge instead of a dead "#" jump    */
  /* ------------------------------------------------------------------ */
  $$('.social-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#') {
        e.preventDefault();
        showToast(btn.getAttribute('title') || 'Add your link in the HTML');
      }
    });
  });

})();
