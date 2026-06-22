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
});
