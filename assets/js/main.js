(function() {
  "use strict";
  const selectBody = document.body;
  const selectHeader = document.querySelector('#header');

  function toggleScrolled() {
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToogle() {
    if (!mobileNavToggleBtn) return;
    document.body.classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active') && !navmenu.classList.contains('toggle-dropdown')) {
        mobileNavToogle();
      }
    });
  });
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });
  let scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function aosInit() {
    if (typeof AOS === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: reduceMotion || isMobile
    });
  }
  window.addEventListener('load', aosInit);

  if (typeof PureCounter !== 'undefined' && document.querySelector('.purecounter')) {
    new PureCounter();
  }

  function initGlightbox() {
    if (typeof GLightbox === 'undefined' || !document.querySelector('.glightbox')) return;
    if (document.body.dataset.glightboxInitialized === 'true') return;
    GLightbox({
      selector: '.glightbox'
    });
    document.body.dataset.glightboxInitialized = 'true';
  }

  function initIsotopeLayouts() {
    if (typeof imagesLoaded === 'undefined' || typeof Isotope === 'undefined') return;
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
      if (isotopeItem.dataset.isotopeInitialized === 'true') return;
      let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
      let initIsotope;
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });
      isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
        filters.addEventListener('click', function() {
          isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
          this.classList.add('filter-active');
          if (initIsotope) {
            initIsotope.arrange({
              filter: this.getAttribute('data-filter')
            });
          }
          if (typeof AOS !== 'undefined' && typeof AOS.refresh === 'function') {
            AOS.refresh();
          }
        }, false);
      });
      isotopeItem.dataset.isotopeInitialized = 'true';
    });
  }

  initGlightbox();
  initIsotopeLayouts();

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  }

  function loadStylesheetOnce(href) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link[href="${href}"]`)) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
      document.head.appendChild(link);
    });
  }

  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      if (swiperElement.dataset.swiperInitialized === 'true') return;
      const configElement = swiperElement.querySelector(".swiper-config");
      if (!configElement) return;
      let config = {};
      try {
        config = JSON.parse(configElement.innerHTML.trim());
      } catch (error) {
        return;
      }
      if (swiperElement.classList.contains("swiper-tab") && typeof initSwiperWithCustomPagination === 'function') {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
      swiperElement.dataset.swiperInitialized = 'true';
    });
  }

  function initSwiperLazy() {
    const swiperTargets = document.querySelectorAll('.init-swiper');
    if (swiperTargets.length === 0) return;

    const startSwiper = () => {
      const tasks = [];
      if (typeof Swiper === 'undefined') {
        tasks.push(loadScriptOnce('assets/vendor/swiper/swiper-bundle.min.js?v=20260323'));
      }
      if (!document.querySelector('link[href="assets/vendor/swiper/swiper-bundle.min.css?v=20260323"]')) {
        tasks.push(loadStylesheetOnce('assets/vendor/swiper/swiper-bundle.min.css?v=20260323'));
      }
      Promise.all(tasks)
        .then(() => initSwiper())
        .catch(() => {});
    };

    if (!('IntersectionObserver' in window)) {
      startSwiper();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const hasVisibleTarget = entries.some((entry) => entry.isIntersecting);
      if (!hasVisibleTarget) return;
      observer.disconnect();
      startSwiper();
    }, {
      rootMargin: '300px 0px'
    });

    swiperTargets.forEach((target) => observer.observe(target));
  }

  function initPortfolioFeaturesLazy() {
    const portfolioSection = document.querySelector('#portfolio');
    const needsPortfolioScripts = document.querySelector('.isotope-layout') || document.querySelector('.glightbox');
    if (!portfolioSection || !needsPortfolioScripts) return;

    const startPortfolioFeatures = () => {
      const tasks = [];
      if (typeof imagesLoaded === 'undefined') {
        tasks.push(loadScriptOnce('assets/vendor/imagesloaded/imagesloaded.pkgd.min.js?v=20260323'));
      }
      if (typeof Isotope === 'undefined') {
        tasks.push(loadScriptOnce('assets/vendor/isotope-layout/isotope.pkgd.min.js?v=20260323'));
      }
      if (typeof GLightbox === 'undefined') {
        tasks.push(loadScriptOnce('assets/vendor/glightbox/js/glightbox.min.js?v=20260323'));
      }
      if (!document.querySelector('link[href="assets/vendor/glightbox/css/glightbox.min.css?v=20260323"]')) {
        tasks.push(loadStylesheetOnce('assets/vendor/glightbox/css/glightbox.min.css?v=20260323'));
      }

      Promise.all(tasks)
        .catch(() => {})
        .finally(() => {
          initGlightbox();
          initIsotopeLayouts();
        });
    };

    if (!('IntersectionObserver' in window)) {
      startPortfolioFeatures();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const hasVisibleTarget = entries.some((entry) => entry.isIntersecting);
      if (!hasVisibleTarget) return;
      observer.disconnect();
      startPortfolioFeatures();
    }, {
      rootMargin: '300px 0px'
    });

    observer.observe(portfolioSection);
  }

  window.addEventListener("load", () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initSwiperLazy, {
        timeout: 2000
      });
    } else {
      setTimeout(initSwiperLazy, 500);
    }
    initPortfolioFeaturesLazy();
  });
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  const navmenulinks = Array.from(document.querySelectorAll('.navmenu a'));
  const navmenuLinksWithSections = navmenulinks
    .map((navmenulink) => {
      if (!navmenulink.hash) return null;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return null;
      return {
        link: navmenulink,
        section: section
      };
    })
    .filter(Boolean);

  let activeNavmenuLink = null;
  function navmenuScrollspy() {
    if (navmenuLinksWithSections.length === 0) return;
    const position = window.scrollY + 200;
    let nextActiveLink = null;

    navmenuLinksWithSections.forEach((item) => {
      const top = item.section.offsetTop;
      const bottom = top + item.section.offsetHeight;
      if (position >= top && position <= bottom) {
        nextActiveLink = item.link;
      }
    });

    if (activeNavmenuLink === nextActiveLink) return;
    if (activeNavmenuLink) {
      activeNavmenuLink.classList.remove('active');
    }
    if (nextActiveLink) {
      nextActiveLink.classList.add('active');
    } else {
      navmenulinks.forEach((link) => link.classList.remove('active'));
    }
    activeNavmenuLink = nextActiveLink;
  }

  let isScrolling = false;
  const handleScroll = () => {
    if (isScrolling) return;
    isScrolling = true;
    requestAnimationFrame(() => {
      toggleScrolled();
      toggleScrollTop();
      navmenuScrollspy();
      isScrolling = false;
    });
  };

  window.addEventListener('load', () => {
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
  });
  document.addEventListener('scroll', handleScroll, {
    passive: true
  });
})();
document.addEventListener('DOMContentLoaded', function() {
  const isEventPage = document.body && document.body.classList.contains('event-page');
  if (!isEventPage) return;

  const isotopeContainer = document.querySelector('.isotope-container');
  if (!isotopeContainer || typeof Isotope === 'undefined') return;

  let iso = new Isotope(isotopeContainer, {
    itemSelector: '.ev-card-container',
    layoutMode: 'fitRows'
  });
  const filterButtons = document.querySelectorAll('.filter-tag');
  const searchInput = document.getElementById('eventSearch');
  const dynamicTitle = document.getElementById('dynamicTitle');
  const paginationList = document.getElementById('paginationList');
  const prevPage = document.getElementById('prevPage');
  const nextPage = document.getElementById('nextPage');
  if (!searchInput || !paginationList || !prevPage || !nextPage || filterButtons.length === 0) return;

  const itemsPerPage = 9;
  let currentPage = 1;
  let filteredItems = [];
  function updateDisplay() {
    const activeFilterBtn = document.querySelector('.filter-tag.active');
    if (!activeFilterBtn) return;
    const activeFilter = activeFilterBtn.getAttribute('data-filter');
    const searchText = searchInput.value.toLowerCase();
    if (activeFilter === '*') {
      if (dynamicTitle) dynamicTitle.innerText = "Semua Paket & Dokumentasi Event";
    } else {
      if (dynamicTitle) dynamicTitle.innerText = "Event Kategori " + activeFilterBtn.innerText;
    }
    const allItems = Array.from(document.querySelectorAll('.ev-card-container'));
    filteredItems = allItems.filter(item => {
      const matchesFilter = activeFilter === '*' || item.classList.contains(activeFilter.substring(1));
      const matchesSearch = item.querySelector('.ev-title').innerText.toLowerCase().includes(searchText);
      return matchesFilter && matchesSearch;
    });
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
    allItems.forEach(item => item.classList.add('hidden-by-page'));
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    filteredItems.slice(start, end).forEach(item => item.classList.remove('hidden-by-page'));
    iso.arrange();
    renderPagination(totalPages);
  }
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      const targetBtn = document.querySelector(`.filter-tag[data-filter=".cat-${filterParam}"]`);
      if (targetBtn) {
        filterButtons.forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
      }
    }
    updateDisplay();
  }
  searchInput.addEventListener('input', () => { currentPage = 1; updateDisplay(); });
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentPage = 1;
      updateDisplay();
    });
  });
  function renderPagination(total) {
    const list = document.getElementById('paginationList');
    const prev = document.getElementById('prevPage');
    const next = document.getElementById('nextPage');
    const oldNumbers = list.querySelectorAll('.page-num');
    oldNumbers.forEach(n => n.remove());
    for (let i = 1; i <= total; i++) {
      const li = document.createElement('li');
      li.className = `page-num ${i === currentPage ? 'active' : ''}`;
      li.innerHTML = `<a>${i}</a>`;
      li.onclick = () => { currentPage = i; updateDisplay(); window.scrollTo(0, 400); };
      next.before(li);
    }
    prev.className = currentPage === 1 ? 'disabled' : '';
    next.className = currentPage === total || total === 0 ? 'disabled' : '';
    prev.onclick = () => { if(currentPage > 1) { currentPage--; updateDisplay(); }};
    next.onclick = () => { if(currentPage < total) { currentPage++; updateDisplay(); }};
  }
  checkUrlParams();
});
