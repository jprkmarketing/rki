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

  new PureCounter();
  const glightbox = GLightbox({
    selector: '.glightbox'
  });
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
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
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof AOS !== 'undefined' && typeof AOS.refresh === 'function') {
          AOS.refresh();
        }
      }, false);
    });
  });
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );
      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }
  window.addEventListener("load", initSwiper);
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
