document.addEventListener('DOMContentLoaded', function () {
  var phoneQuery = window.matchMedia('(max-width: 760px)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // ===== Phone menu: toggles, and closes on Escape, an outside tap or a link tap =====
  var toggle = document.querySelector('.nav__hamburger');
  var links = document.querySelector('.nav__links');

  var setMenu = function (open) {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  if (toggle && links) {
    if (!links.id) links.id = 'site-menu';
    toggle.setAttribute('aria-controls', links.id);
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(!links.classList.contains('is-open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (links.classList.contains('is-open') && !links.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  // ===== Practices dropdown: hover on mouse devices, click and Escape everywhere =====
  var dropdown = document.querySelector('.nav__dropdown');
  var dropdownToggle = document.querySelector('.nav__dropdown-toggle');

  if (dropdown && dropdownToggle) {
    var menu = dropdown.querySelector('.nav__dropdown-menu');
    if (menu && !menu.id) menu.id = 'practices-menu';
    if (menu) dropdownToggle.setAttribute('aria-controls', menu.id);
    dropdownToggle.removeAttribute('aria-haspopup');
    var closeTimer = null;

    var openDropdown = function () {
      clearTimeout(closeTimer);
      dropdown.classList.add('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'true');
    };
    var closeDropdown = function () {
      clearTimeout(closeTimer);
      dropdown.classList.remove('is-open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    };

    dropdown.addEventListener('mouseenter', function () { if (finePointer.matches) openDropdown(); });
    dropdown.addEventListener('mouseleave', function () {
      if (!finePointer.matches) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeDropdown, 300);
    });
    dropdownToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (dropdown.classList.contains('is-open')) closeDropdown(); else openDropdown();
    });
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) closeDropdown();
    });
    dropdown.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dropdown.classList.contains('is-open')) {
        closeDropdown();
        dropdownToggle.focus();
      }
    });
  }

  // ===== Wide screens: list sections get a header-left / content-right layout =====
  document.querySelectorAll('.section > .container').forEach(function (container) {
    var first = container.firstElementChild;
    if (!first || !first.classList.contains('section__header')) return;
    if (container.closest('.section--statement')) return;
    var kids = Array.prototype.slice.call(container.children);
    var hasList = kids.some(function (k) { return k.matches('.tag-cloud, .checklist, ol.process-steps'); });
    var hasWide = kids.some(function (k) { return k.matches('.grid, .faq-list, .form-card, .process__steps, .related-practices'); });
    if (hasList && !hasWide) container.classList.add('split');
  });

  // ===== Short lists (e.g. role names) split into two columns =====
  document.querySelectorAll('.card__list, .checklist').forEach(function (list) {
    var items = list.querySelectorAll('li');
    if (items.length < 4) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].textContent.trim().length > 26) return;
    }
    list.classList.add('list--split');
  });

  // ===== Option and level cards: tabs on phones, side by side on wide screens =====
  var tabGroups = [];
  document.querySelectorAll('.grid').forEach(function (grid, g) {
    var cards = Array.prototype.slice.call(grid.children);
    if (cards.length < 2) return;
    var labels = cards.map(function (c) { return c.querySelector('.option-card__label'); });
    if (labels.some(function (l) { return !l; })) return;

    var tablist = document.createElement('div');
    tablist.className = 'tablist';
    tablist.setAttribute('role', 'tablist');
    var buttons = cards.map(function (card, i) {
      if (!card.id) card.id = 'tabpanel-' + g + '-' + i;
      card.setAttribute('role', 'tabpanel');
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', card.id);
      b.textContent = labels[i].textContent.trim();
      tablist.appendChild(b);
      return b;
    });
    var select = function (i, focus) {
      cards.forEach(function (c, j) { c.classList.toggle('is-active', j === i); });
      buttons.forEach(function (b, j) {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
        b.tabIndex = j === i ? 0 : -1;
      });
      if (focus) buttons[i].focus();
    };
    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () { select(i); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') select((i + 1) % buttons.length, true);
        if (e.key === 'ArrowLeft') select((i - 1 + buttons.length) % buttons.length, true);
      });
    });
    grid.parentNode.insertBefore(tablist, grid);
    grid.classList.add('tabbed');
    select(0);
    tabGroups.push(grid);
  });

  // ===== Phone card sets: decks for mid-size cards, tiles for short ones, stacks for tall ones =====
  var titleOf = function (card) {
    var t = card.querySelector('.card__title, .practice-card__title, .step__title, h3');
    return t ? t.textContent.trim() : '';
  };
  var groups = [];
  document.querySelectorAll('.grid').forEach(function (grid) {
    if (grid.children.length < 3 || grid.hasAttribute('data-stack') || grid.classList.contains('tabbed')) return;
    var dots = document.createElement('div');
    dots.className = 'deck-dots';
    dots.hidden = true;
    Array.prototype.forEach.call(grid.children, function (card, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', titleOf(card) || String(i + 1));
      b.addEventListener('click', function () {
        var target = card.offsetLeft - grid.firstElementChild.offsetLeft;
        var start = grid.scrollLeft;
        grid.scrollTo({ left: target, behavior: 'smooth' });
        // Some browsers skip smooth scrolling (background tabs, reduced motion): jump instead
        setTimeout(function () {
          if (grid.scrollLeft === start && Math.abs(target - start) > 4) grid.scrollLeft = target;
        }, 450);
      });
      dots.appendChild(b);
    });
    grid.parentNode.insertBefore(dots, grid.nextSibling);
    var update = function () {
      var cards = grid.children;
      var active = 0;
      if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 4) {
        active = cards.length - 1;
      } else {
        for (var j = 0; j < cards.length; j++) {
          if (cards[j].offsetLeft - grid.firstElementChild.offsetLeft <= grid.scrollLeft + 30) active = j;
        }
      }
      for (var k = 0; k < dots.children.length; k++) dots.children[k].classList.toggle('is-active', k === active);
    };
    grid.addEventListener('scroll', update, { passive: true });
    groups.push({ grid: grid, dots: dots, update: update });
  });

  var layoutGroups = function () {
    groups.forEach(function (g) {
      g.grid.classList.remove('deck', 'tiles');
      g.dots.hidden = true;
      if (!phoneQuery.matches) return;
      g.grid.classList.add('deck');
      g.grid.style.alignItems = 'start';
      var tallest = 0;
      Array.prototype.forEach.call(g.grid.children, function (c) { tallest = Math.max(tallest, c.offsetHeight); });
      g.grid.style.alignItems = '';
      if (tallest > window.innerHeight * 0.6) {
        g.grid.classList.remove('deck');
      } else if (tallest < 170 && g.grid.children.length >= 4) {
        g.grid.classList.remove('deck');
        g.grid.classList.add('tiles');
      } else {
        g.dots.hidden = false;
        g.update();
      }
    });
  };
  layoutGroups();
  phoneQuery.addEventListener('change', layoutGroups);
  window.addEventListener('load', layoutGroups);
  var relayoutTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(relayoutTimer);
    relayoutTimer = setTimeout(layoutGroups, 150);
  });

  // ===== Reveal on scroll: a card set reveals together, so swiped-in cards are never blank =====
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var items = entry.target.__revealItems || [entry.target];
        items.forEach(function (el) { el.classList.add('is-visible'); });
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    var seen = [];
    document.querySelectorAll('.card, .practice-card, .step, .form-card:not(.is-success)').forEach(function (el) {
      if (seen.indexOf(el) !== -1) return;
      var group = el.parentElement && el.parentElement.matches('.grid, .process__steps') ? el.parentElement : null;
      var items = group ? Array.prototype.filter.call(group.children, function (c) { return c.matches('.card, .practice-card, .step'); }) : [el];
      items.forEach(function (item, i) {
        seen.push(item);
        item.classList.add('reveal');
        item.style.transitionDelay = (i % 6) * 0.06 + 's';
      });
      var target = group || el;
      target.__revealItems = items;
      revealObserver.observe(target);
    });
  }

  // ===== Reading progress line under the nav =====
  var nav = document.querySelector('.nav');
  var progress = document.createElement('div');
  progress.className = 'read-progress';
  progress.appendChild(document.createElement('span'));
  if (nav) nav.appendChild(progress);

  // ===== Sticky action bar: each page's own actions, for its audiences =====
  var isFormPage = /\/engage\/?$/.test(window.location.pathname);
  var sources = Array.prototype.slice.call(document.querySelectorAll('.hero__actions .btn'), 0, 2);
  var navCta = document.querySelector('.nav__cta');
  var mandate = document.querySelector('a.btn[href^="mailto:"]');
  if (sources.length === 1 && mandate) sources.push(mandate);
  if (sources.length === 1 && navCta && sources[0].getAttribute('href').charAt(0) === '#') sources.push(navCta);
  if (!sources.length && navCta) sources.push(navCta);

  var bar = null;
  var anchorTargets = [];
  if (!isFormPage && sources.length) {
    bar = document.createElement('div');
    bar.className = 'phone-cta';
    sources.forEach(function (src, s) {
      var btn = src.cloneNode(true);
      btn.className = s === 0 ? 'btn btn--primary btn--stacked' : 'btn btn--outline-light btn--stacked';
      btn.removeAttribute('style');
      bar.appendChild(btn);
      var href = src.getAttribute('href') || '';
      if (href.charAt(0) === '#' && href.length > 1) {
        var target = document.querySelector(href);
        if (target) anchorTargets.push(target);
      }
    });
    document.body.appendChild(bar);
  }

  var hero = document.querySelector('.hero');
  var footer = document.querySelector('.footer');
  var forms = document.querySelectorAll('form');
  var inView = function (el) { var r = el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0; };
  var onScroll = function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    progress.firstChild.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';

    if (!bar) return;
    var pastHero = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 400;
    var blocked = (footer && inView(footer)) ||
      Array.prototype.some.call(forms, inView) ||
      anchorTargets.some(inView);
    var show = pastHero && !blocked;
    bar.classList.toggle('is-visible', show);
    if (show) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { onScroll(); });
  onScroll();

  // ===== Forms: one send per tap, and the thank-you message takes focus =====
  forms.forEach(function (form) {
    form.addEventListener('submit', function () {
      var submit = form.querySelector('[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.setAttribute('aria-busy', 'true');
      }
    });
  });
  document.querySelectorAll('.is-success').forEach(function (thanks) {
    if (thanks.style.display === 'block') thanks.focus({ preventScroll: true });
  });
});
