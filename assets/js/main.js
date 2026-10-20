// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav__hamburger');
  var links = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Practices nav dropdown
  var dropdown = document.querySelector('.nav__dropdown');
  var dropdownToggle = document.querySelector('.nav__dropdown-toggle');

  if (dropdown && dropdownToggle) {
    var closeTimer = null;

    var openDropdown = function () {
      clearTimeout(closeTimer);
      dropdown.classList.add('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'true');
    };

    var closeDropdown = function () {
      dropdown.classList.remove('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    };

    // Keep the menu available for a couple of seconds after the mouse
    // leaves, so moving the pointer toward the menu doesn't get raced.
    var scheduleClose = function () {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeDropdown, 2000);
    };

    dropdown.addEventListener('mouseenter', openDropdown);
    dropdown.addEventListener('mouseleave', scheduleClose);

    dropdownToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      clearTimeout(closeTimer);
      if (dropdown.classList.contains('is-open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        clearTimeout(closeTimer);
        closeDropdown();
      }
    });
  }

  // Scroll reveal for cards and tiles
  var revealEls = document.querySelectorAll('.card, .practice-card, .step, .form-card');

  if (revealEls.length && 'IntersectionObserver' in window) {
    revealEls.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 6) * 0.08 + 's';
    });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  // ===== Phone storyboard layer (styles only apply at 760px and below) =====

  // Dots under each swipeable card deck
  document.querySelectorAll('.grid, .process__steps, .process-steps--detailed').forEach(function (deck) {
    var cards = deck.children;
    if (cards.length < 3) return;
    var dots = document.createElement('div');
    dots.className = 'deck-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < cards.length; i++) dots.appendChild(document.createElement('span'));
    deck.parentNode.insertBefore(dots, deck.nextSibling);

    var update = function () {
      var active = 0;
      var atEnd = deck.scrollLeft + deck.clientWidth >= deck.scrollWidth - 4;
      if (atEnd) {
        active = cards.length - 1;
      } else {
        for (var j = 0; j < cards.length; j++) {
          if (cards[j].offsetLeft - deck.offsetLeft <= deck.scrollLeft + 30) active = j;
        }
      }
      for (var k = 0; k < dots.children.length; k++) dots.children[k].classList.toggle('is-active', k === active);
    };
    deck.addEventListener('scroll', update, { passive: true });
    update();
  });

  // Short lists (e.g. role names) split into two columns
  document.querySelectorAll('.card__list, .checklist').forEach(function (list) {
    var items = list.querySelectorAll('li');
    if (items.length < 4) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].textContent.trim().length > 26) return;
    }
    list.classList.add('list--split');
  });

  // Reading progress line under the nav
  var nav = document.querySelector('.nav');
  var progress = document.createElement('div');
  progress.className = 'read-progress';
  progress.appendChild(document.createElement('span'));
  if (nav) nav.appendChild(progress);

  // Sticky action bar: the hero's own buttons (or the nav CTA), shown once the hero is passed
  var isFormPage = /\/engage\/?$/.test(window.location.pathname);
  var source = document.querySelectorAll('.hero__actions .btn');
  if (!source.length) source = document.querySelectorAll('.nav__cta');
  var bar = null;
  if (!isFormPage && source.length) {
    bar = document.createElement('div');
    bar.className = 'phone-cta';
    for (var s = 0; s < Math.min(source.length, 2); s++) {
      var btn = source[s].cloneNode(true);
      btn.className = s === 0 ? 'btn btn--primary' : 'btn btn--outline-light';
      bar.appendChild(btn);
    }
    document.body.appendChild(bar);
  }

  var hero = document.querySelector('.hero');
  var footer = document.querySelector('.footer');
  var forms = document.querySelectorAll('form');
  var onScroll = function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    progress.firstChild.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';

    if (!bar) return;
    var pastHero = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 400;
    var inView = function (el) { var r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; };
    var blocked = (footer && inView(footer)) || Array.prototype.some.call(forms, inView);
    bar.classList.toggle('is-visible', pastHero && !blocked);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
});
