/**
 * KD STORE - Enhanced Application Logic
 * Large Platform Buttons, Dynamic Sub-filters, Sorting, Quick Stepper & WhatsApp Generator
 */

(function () {
  'use strict';

  // State Management
  const state = {
    selectedPlatform: 'all',
    selectedSubType: 'all',
    selectedSort: 'default',
    searchQuery: '',
    currentCurrency: CONFIG.currency.defaultRate || 'SDG',
    selectedService: null,
    orderQuantity: 1000,
    orderLink: '',
    currentPage: 1,
    itemsPerPage: 24,
    filteredServices: []
  };

  // Platform Definitions with rich branding
  const PLATFORMS_CONFIG = [
    {
      id: 'all',
      name: 'جميع الخدمات',
      nameEn: 'All Services',
      icon: 'fas fa-th-large',
      color: '#00e5ff',
      gradient: 'linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)',
      borderColor: '#00e5ff',
      glow: 'rgba(0, 229, 255, 0.3)'
    },
    {
      id: 'tiktok',
      name: 'تيك توك',
      nameEn: 'TikTok',
      icon: 'fab fa-tiktok',
      color: '#fe2c55',
      gradient: 'linear-gradient(135deg, rgba(254, 44, 85, 0.25) 0%, rgba(37, 244, 238, 0.15) 100%)',
      borderColor: '#fe2c55',
      glow: 'rgba(254, 44, 85, 0.35)'
    },
    {
      id: 'instagram',
      name: 'انستغرام',
      nameEn: 'Instagram',
      icon: 'fab fa-instagram',
      color: '#e1306c',
      gradient: 'linear-gradient(135deg, rgba(225, 48, 108, 0.25) 0%, rgba(253, 29, 29, 0.15) 50%, rgba(245, 96, 64, 0.15) 100%)',
      borderColor: '#e1306c',
      glow: 'rgba(225, 48, 108, 0.35)'
    },
    {
      id: 'telegram',
      name: 'تيليجرام',
      nameEn: 'Telegram',
      icon: 'fab fa-telegram-plane',
      color: '#0088cc',
      gradient: 'linear-gradient(135deg, rgba(0, 136, 204, 0.25) 0%, rgba(34, 158, 217, 0.15) 100%)',
      borderColor: '#0088cc',
      glow: 'rgba(0, 136, 204, 0.35)'
    },
    {
      id: 'facebook',
      name: 'فيسبوك',
      nameEn: 'Facebook',
      icon: 'fab fa-facebook-f',
      color: '#1877f2',
      gradient: 'linear-gradient(135deg, rgba(24, 119, 242, 0.25) 0%, rgba(66, 103, 178, 0.15) 100%)',
      borderColor: '#1877f2',
      glow: 'rgba(24, 119, 242, 0.35)'
    },
    {
      id: 'youtube',
      name: 'يوتيوب',
      nameEn: 'YouTube',
      icon: 'fab fa-youtube',
      color: '#ff0000',
      gradient: 'linear-gradient(135deg, rgba(255, 0, 0, 0.25) 0%, rgba(200, 0, 0, 0.15) 100%)',
      borderColor: '#ff0000',
      glow: 'rgba(255, 0, 0, 0.35)'
    },
    {
      id: 'whatsapp',
      name: 'واتساب',
      nameEn: 'WhatsApp',
      icon: 'fab fa-whatsapp',
      color: '#25d366',
      gradient: 'linear-gradient(135deg, rgba(37, 211, 102, 0.25) 0%, rgba(18, 140, 126, 0.15) 100%)',
      borderColor: '#25d366',
      glow: 'rgba(37, 211, 102, 0.35)'
    },
    {
      id: 'twitter',
      name: 'تويتر / X',
      nameEn: 'Twitter / X',
      icon: 'fab fa-x-twitter',
      color: '#1da1f2',
      gradient: 'linear-gradient(135deg, rgba(29, 161, 242, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
      borderColor: '#1da1f2',
      glow: 'rgba(29, 161, 242, 0.35)'
    },
    {
      id: 'ai',
      name: 'اشتراكات و AI',
      nameEn: 'AI & Tools',
      icon: 'fas fa-robot',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)',
      borderColor: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.35)'
    },
    {
      id: 'other',
      name: 'خدمات عامة',
      nameEn: 'General Services',
      icon: 'fas fa-bolt',
      color: '#ffa502',
      gradient: 'linear-gradient(135deg, rgba(255, 165, 2, 0.25) 0%, rgba(255, 71, 87, 0.15) 100%)',
      borderColor: '#ffa502',
      glow: 'rgba(255, 165, 2, 0.35)'
    }
  ];

  // DOM Elements
  const elements = {
    platformCardsGrid: document.getElementById('platformCardsGrid'),
    subTypesBar: document.getElementById('subTypesBar'),
    subTypesList: document.getElementById('subTypesList'),
    servicesGrid: document.getElementById('servicesGrid'),
    currentSectionTitle: document.getElementById('currentSectionTitle'),
    resultsCount: document.getElementById('resultsCount'),
    servicesSort: document.getElementById('servicesSort'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    currencySelect: document.getElementById('currencySelect'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    loadMoreWrapper: document.getElementById('loadMoreWrapper'),
    
    // Order Modal
    orderModal: document.getElementById('orderModal'),
    modalServiceTitle: document.getElementById('modalServiceTitle'),
    modalServiceId: document.getElementById('modalServiceId'),
    modalServiceCategory: document.getElementById('modalServiceCategory'),
    modalServiceGuarantee: document.getElementById('modalServiceGuarantee'),
    modalServiceSpeed: document.getElementById('modalServiceSpeed'),
    modalServicePrice1k: document.getElementById('modalServicePrice1k'),
    modalServiceLimits: document.getElementById('modalServiceLimits'),
    orderQtyInput: document.getElementById('orderQtyInput'),
    orderQtySlider: document.getElementById('orderQtySlider'),
    qtyFeedback: document.getElementById('qtyFeedback'),
    orderLinkInput: document.getElementById('orderLinkInput'),
    calcTotalPrice: document.getElementById('calcTotalPrice'),
    calcAltPrice: document.getElementById('calcAltPrice'),
    whatsappOrderBtn: document.getElementById('whatsappOrderBtn'),
    copyOrderBtn: document.getElementById('copyOrderBtn'),
    closeOrderModalBtn: document.getElementById('closeOrderModalBtn'),

    // Track Modal
    trackModal: document.getElementById('trackModal'),
    trackOrderBtn: document.getElementById('trackOrderBtn'),
    mobileTrackBtn: document.getElementById('mobileTrackBtn'),
    closeTrackModalBtn: document.getElementById('closeTrackModalBtn'),
    trackOrderInput: document.getElementById('trackOrderInput'),
    submitTrackBtn: document.getElementById('submitTrackBtn'),
    trackResultBox: document.getElementById('trackResultBox'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer'),

    // Gemini Banner
    geminiOrderBtn: document.getElementById('geminiOrderBtn'),

    // New Enhancement Elements
    detailsModal: document.getElementById('detailsModal'),
    detailsModalBody: document.getElementById('detailsModalBody'),
    closeDetailsModalBtn: document.getElementById('closeDetailsModalBtn'),
    tickerBar: document.getElementById('tickerBar'),
    tickerContent: document.getElementById('tickerContent'),
    tickerCloseBtn: document.getElementById('tickerCloseBtn')
  };

  /**
   * Price Calculations with Profit Margin & Currency Conversion
   */
  function getSellingPricePer1k(basePrice1k) {
    const margin = CONFIG.profitMargin || 0.35;
    let sellingPrice = basePrice1k * (1 + margin);
    
    if (sellingPrice < 0.05) {
      sellingPrice = Math.max(0.01, Math.ceil(sellingPrice * 1000) / 1000);
    } else {
      sellingPrice = Math.ceil(sellingPrice * 100) / 100;
    }
    return sellingPrice;
  }

  function calculateTotalOrderPrice(service, quantity) {
    if (!service) return 0;

    const pricePer1k = getSellingPricePer1k(service.base_price_1k);
    return (pricePer1k * quantity) / 1000;
  }

  function formatCurrency(amountUSD, currencyCode = state.currentCurrency) {
    const currencyInfo = CONFIG.currency.rates[currencyCode] || CONFIG.currency.rates.USD;
    const converted = amountUSD * currencyInfo.rate;

    if (currencyCode === 'USD') {
      if (converted < 0.01) return `$${converted.toFixed(4)}`;
      return `$${converted.toFixed(2)}`;
    } else if (currencyCode === 'SDG') {
      return `${Math.round(converted).toLocaleString('ar-EG')} ${currencyInfo.symbol}`;
    } else {
      return `${converted.toFixed(2)} ${currencyInfo.symbol}`;
    }
  }

  /**
   * Toast Notifications
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    if (type === 'error') iconClass = 'fas fa-exclamation-triangle';

    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * Render Large Platform Buttons Grid
   */
  function initPlatformCards() {
    const counts = { all: SERVICES_DATA.length };
    SERVICES_DATA.forEach(s => {
      counts[s.platform] = (counts[s.platform] || 0) + 1;
    });

    let html = '';
    PLATFORMS_CONFIG.forEach(plat => {
      const count = counts[plat.id] || 0;
      const isActive = plat.id === state.selectedPlatform ? 'active' : '';

      html += `
        <div class="platcard ${isActive}"
             data-platform="${plat.id}"
             style="--c:${plat.color}; --g:${plat.glow};">
          <div class="platcard-check"><i class="fas fa-check"></i></div>
          <div class="platcard-icon"><i class="${plat.icon}"></i></div>
          <div class="platcard-name">${plat.name}</div>
          <div class="platcard-en">${plat.nameEn}</div>
          <div class="platcard-count"><i class="fas fa-layer-group" style="font-size:.55rem"></i> ${count}</div>
        </div>
      `;
    });

    elements.platformCardsGrid.innerHTML = html;

    // Attach click events to platform cards
    elements.platformCardsGrid.querySelectorAll('.platcard').forEach(card => {
      card.addEventListener('click', () => {
        const platId = card.dataset.platform;
        selectPlatform(platId);
      });
    });
  }

  /**
   * Select a Platform
   */
  window.selectPlatform = function(platId) {
    state.selectedPlatform = platId;
    state.selectedSubType = 'all';
    state.currentPage = 1;

    // Update active class on cards
    elements.platformCardsGrid.querySelectorAll('.platcard').forEach(card => {
      card.classList.toggle('active', card.dataset.platform === platId);
    });

    // Update Section Title
    const foundPlat = PLATFORMS_CONFIG.find(p => p.id === platId);
    elements.currentSectionTitle.textContent = foundPlat ? `خدمات ${foundPlat.name}` : 'جميع الخدمات';

    updateSubTypesBar();
    applyFilters();
  };

  /**
   * Update Sub-Type Filter Tags Bar
   */
  function updateSubTypesBar() {
    const relevantServices = SERVICES_DATA.filter(s => 
      state.selectedPlatform === 'all' || s.platform === state.selectedPlatform
    );

    // Collect available sub-types in this platform
    const subTypesMap = { all: { name: 'الكل', icon: 'fas fa-th-list', count: relevantServices.length } };

    relevantServices.forEach(s => {
      if (!subTypesMap[s.sub_type]) {
        subTypesMap[s.sub_type] = {
          name: s.sub_type_name,
          icon: s.sub_icon,
          count: 0
        };
      }
      subTypesMap[s.sub_type].count++;
    });

    const subTypeKeys = Object.keys(subTypesMap);

    // If more than 1 distinct sub-type, show the bar
    if (subTypeKeys.length > 2) {
      let html = '';
      subTypeKeys.forEach(k => {
        const item = subTypesMap[k];
        const isActive = k === state.selectedSubType ? 'active' : '';
        html += `
          <button class="subtype-chip ${isActive}" data-subtype="${k}">
            <i class="${item.icon}"></i>
            <span>${item.name}</span>
            <small style="opacity: 0.75;">(${item.count})</small>
          </button>
        `;
      });

      elements.subTypesList.innerHTML = html;
      elements.subTypesBar.style.display = 'flex';

      elements.subTypesList.querySelectorAll('.subtype-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          elements.subTypesList.querySelectorAll('.subtype-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          state.selectedSubType = chip.dataset.subtype;
          state.currentPage = 1;
          applyFilters();
        });
      });
    } else {
      elements.subTypesBar.style.display = 'none';
    }
  }

  /**
   * Filter & Sort Services
   */
  function applyFilters() {
    const q = state.searchQuery.trim().toLowerCase();

    state.filteredServices = SERVICES_DATA.filter(service => {
      // Platform Match
      const matchesPlatform = state.selectedPlatform === 'all' || service.platform === state.selectedPlatform;
      if (!matchesPlatform) return false;

      // Sub-type Match
      const matchesSubType = state.selectedSubType === 'all' || service.sub_type === state.selectedSubType;
      if (!matchesSubType) return false;

      // Search Query Match
      if (q) {
        const idMatch = String(service.id).includes(q);
        const nameMatch = service.name.toLowerCase().includes(q);
        const platMatch = service.platform_name.toLowerCase().includes(q);
        const guarMatch = service.guarantee.toLowerCase().includes(q);
        return idMatch || nameMatch || platMatch || guarMatch;
      }
      return true;
    });

    // Sorting
    if (state.selectedSort === 'price-asc') {
      state.filteredServices.sort((a, b) => a.base_price_1k - b.base_price_1k);
    } else if (state.selectedSort === 'price-desc') {
      state.filteredServices.sort((a, b) => b.base_price_1k - a.base_price_1k);
    } else if (state.selectedSort === 'guarantee') {
      const rank = { lifetime: 5, year: 4, high: 3, medium: 2, low: 1, none: 0 };
      state.filteredServices.sort((a, b) => (rank[b.guarantee_level] || 0) - (rank[a.guarantee_level] || 0));
    }

    elements.resultsCount.textContent = `(${state.filteredServices.length} خدمة متوفرة)`;
    renderServices();
  }

  /**
   * Render Services Grid Cards
   */
  function renderServices() {
    const grid = elements.servicesGrid;
    const servicesToShow = state.filteredServices.slice(0, state.currentPage * state.itemsPerPage);

    if (state.filteredServices.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search-minus"></i>
          <h3>لم يتم العثور على خدمات مطابقة</h3>
          <p>جرّب اختيار منصة أخرى أو كتابة كلمات بحث مختلفة.</p>
        </div>
      `;
      elements.loadMoreWrapper.style.display = 'none';
      return;
    }

    let html = '';
    servicesToShow.forEach(service => {
      const pricePer1k = getSellingPricePer1k(service.base_price_1k);
      const formattedPrice = formatCurrency(pricePer1k);

      const isReaction = Boolean(service.sub_type === 'reactions' || service.reaction_type);

      // Reaction type badge (icon-based, no emoji)
      const reactionBadgeHtml = isReaction ? `
        <div class="rx-badge"
             style="--c:${service.color}; --g:${service.glow}; border-color:${service.border_color || service.color};">
          <span class="rx-icon"><i class="${service.sub_icon || 'fas fa-star'}"></i></span>
          <span class="rx-badge-label">${service.reaction_type || service.sub_type_name}</span>
        </div>
      ` : '';

      const rxBtnBg = service.btn_gradient || service.color || 'var(--violet)';

      html += `
        <div class="sc ${isReaction ? 'sc--rx' : ''}" data-id="${service.id}"
             style="--c:${service.color}; --g:${service.glow}; ${isReaction ? `--rxbtn:${rxBtnBg};` : ''}">

          <div class="sc-head">
            <span class="sc-platform">
              <i class="${service.icon}"></i> ${service.platform_name}
            </span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button class="sc-info-btn info-btn" data-id="${service.id}" title="عرض التفاصيل الكاملة">
                <i class="fas fa-info"></i>
              </button>
              <span class="sc-num">#${service.id}</span>
            </div>
          </div>

          ${reactionBadgeHtml}

          <h3 class="sc-title">${service.name}</h3>
          <p class="sc-desc">${service.description || ''}</p>

          <div class="sc-meta">
            <span class="sc-g"><i class="fas fa-shield-check"></i> ${service.guarantee}</span>
            <span class="sc-s"><i class="fas fa-gauge-high"></i> ${service.speed}</span>
          </div>

          <div class="sc-bot">
            <div class="sc-price">
              <span class="sc-price-v">${formattedPrice}</span>
              <span class="sc-price-l">/1000</span>
            </div>
            <div class="sc-limits">
              <b>${service.min.toLocaleString()}</b>
              <i class="fas fa-arrows-left-right" style="font-size:.55rem;color:var(--t3)"></i>
              <b>${service.max.toLocaleString()}</b>
            </div>
          </div>

          <button class="sc-cta order-btn ${isReaction ? 'sc-cta--rx' : ''}" data-id="${service.id}">
            ${isReaction
              ? `<i class="${service.sub_icon || 'fas fa-star'}"></i>`
              : `<i class="fab fa-whatsapp"></i>`}
            اطلب الآن
            <i class="fas fa-arrow-left sc-cta-arr"></i>
          </button>
        </div>
      `;
    });

    grid.innerHTML = html;

    // Load More Visibility
    if (servicesToShow.length < state.filteredServices.length) {
      elements.loadMoreWrapper.style.display = 'flex';
    } else {
      elements.loadMoreWrapper.style.display = 'none';
    }

    // Attach order & info click handlers
    grid.querySelectorAll('.order-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sId = parseInt(btn.dataset.id, 10);
        const found = SERVICES_DATA.find(s => s.id === sId);
        if (found) openOrderModal(found);
      });
    });

    grid.querySelectorAll('.info-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sId = parseInt(btn.dataset.id, 10);
        const found = SERVICES_DATA.find(s => s.id === sId);
        if (found) openDetailsModal(found);
      });
    });

    // Scroll Animation Observer for Staggered Fade-in
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('sc-visible');
            }, (idx % 6) * 50);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });

      grid.querySelectorAll('.sc').forEach(card => observer.observe(card));
    } else {
      grid.querySelectorAll('.sc').forEach(card => card.classList.add('sc-visible'));
    }
  }

  /**
   * Service Details Modal Logic
   */
  function openDetailsModal(service) {
    if (!elements.detailsModal || !elements.detailsModalBody) return;

    const pricePer1k = getSellingPricePer1k(service.base_price_1k);
    const formattedPrice = formatCurrency(pricePer1k);

    elements.detailsModalBody.innerHTML = `
      <div style="text-align: right;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span style="font-size: 0.8rem; font-weight: 800; color: ${service.color}; background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 20px; border: 1px solid ${service.color};">
            <i class="${service.icon}"></i> ${service.platform_name}
          </span>
          <span style="font-size: 0.8rem; color: var(--t3);">رقم الخدمة #${service.id}</span>
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--t1); margin-bottom: 8px;">${service.name}</h3>
        <p style="font-size: 0.88rem; color: var(--t2); line-height: 1.6; margin-bottom: 16px;">${service.description || 'خدمة رقمية ممتازة وعالية السرعة والتنفيذ الأوتوماتيكي المباشر.'}</p>
        
        <div class="specs-grid">
          <div class="spec-box">
            <div class="spec-icon"><i class="fas fa-shield-check"></i></div>
            <div class="spec-info">
              <span class="spec-label">الضمان والتعويض</span>
              <span class="spec-val">${service.guarantee}</span>
            </div>
          </div>
          <div class="spec-box">
            <div class="spec-icon"><i class="fas fa-bolt"></i></div>
            <div class="spec-info">
              <span class="spec-label">سرعة التنفيذ</span>
              <span class="spec-val">${service.speed}</span>
            </div>
          </div>
          <div class="spec-box">
            <div class="spec-icon"><i class="fas fa-arrow-down-short-wide"></i></div>
            <div class="spec-info">
              <span class="spec-label">الحد الأدنى</span>
              <span class="spec-val">${service.min.toLocaleString()}</span>
            </div>
          </div>
          <div class="spec-box">
            <div class="spec-icon"><i class="fas fa-arrow-up-wide-short"></i></div>
            <div class="spec-info">
              <span class="spec-label">الحد الأقصى</span>
              <span class="spec-val">${service.max.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: var(--r2); padding: 14px; margin: 16px 0; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <span style="font-size: 0.78rem; color: var(--t3); display: block;">السعر الإجمالي لكل 1,000:</span>
            <span style="font-size: 1.3rem; font-weight: 900; color: var(--gp);">${formattedPrice}</span>
          </div>
          <button class="btn btn-whatsapp btn-sm order-now-from-details" data-id="${service.id}">
            <i class="fab fa-whatsapp"></i> اطلب الخدمة الآن
          </button>
        </div>
      </div>
    `;

    elements.detailsModal.classList.add('active');

    const orderBtn = elements.detailsModalBody.querySelector('.order-now-from-details');
    if (orderBtn) {
      orderBtn.addEventListener('click', () => {
        closeDetailsModal();
        openOrderModal(service);
      });
    }
  }

  function closeDetailsModal() {
    if (elements.detailsModal) elements.detailsModal.classList.remove('active');
  }

  /**
   * Order Modal & Live Price Calculator
   */
  function openOrderModal(service) {
    state.selectedService = service;
    
    const defaultQty = Math.max(service.min, Math.min(1000, service.max));
    state.orderQuantity = defaultQty;
    state.orderLink = '';

    elements.modalServiceTitle.textContent = service.name;
    elements.modalServiceId.textContent = `#${service.id}`;
    elements.modalServiceCategory.textContent = service.platform_name;
    elements.modalServiceGuarantee.textContent = service.guarantee;
    elements.modalServiceSpeed.textContent = service.speed;

    // Custom Order Modal Button Color for reactions
    if (service.btn_gradient) {
      elements.whatsappOrderBtn.style.background = service.btn_gradient;
      elements.whatsappOrderBtn.style.boxShadow = `0 8px 25px ${service.glow || 'rgba(0,0,0,0.3)'}`;
    } else if (service.emoji && service.color) {
      elements.whatsappOrderBtn.style.background = service.color;
      elements.whatsappOrderBtn.style.boxShadow = `0 8px 25px ${service.glow || 'rgba(0,0,0,0.3)'}`;
    } else {
      elements.whatsappOrderBtn.style.background = 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)';
      elements.whatsappOrderBtn.style.boxShadow = '0 8px 20px rgba(37, 211, 102, 0.25)';
    }

    const pricePer1k = getSellingPricePer1k(service.base_price_1k);
    elements.modalServicePrice1k.textContent = formatCurrency(pricePer1k, 'USD');
    elements.modalServiceLimits.textContent = `الحد الأدنى للطلب: ${service.min.toLocaleString()} | الحد الأقصى: ${service.max.toLocaleString()}`;

    // Setup input limits
    elements.orderQtyInput.min = service.min;
    elements.orderQtyInput.max = service.max;
    elements.orderQtyInput.value = defaultQty;

    elements.orderQtySlider.min = service.min;
    elements.orderQtySlider.max = Math.min(service.max, 50000);
    elements.orderQtySlider.value = defaultQty;

    elements.orderLinkInput.value = '';

    updateOrderCalculation();
    elements.orderModal.classList.add('active');
  }

  function updateOrderCalculation() {
    if (!state.selectedService) return;

    let qty = parseInt(elements.orderQtyInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = state.selectedService.min;
    state.orderQuantity = qty;

    elements.qtyFeedback.textContent = `${qty.toLocaleString()} وحدة`;

    const totalUSD = calculateTotalOrderPrice(state.selectedService, qty);
    
    // Display in selected currency
    elements.calcTotalPrice.textContent = formatCurrency(totalUSD, state.currentCurrency);
    
    if (state.currentCurrency !== 'USD') {
      elements.calcAltPrice.textContent = `(ما يعادل: ${formatCurrency(totalUSD, 'USD')})`;
      elements.calcAltPrice.style.display = 'block';
    } else {
      const sdgEquivalent = formatCurrency(totalUSD, 'SDG');
      elements.calcAltPrice.textContent = `(${sdgEquivalent})`;
      elements.calcAltPrice.style.display = 'block';
    }
  }

  function closeOrderModal() {
    elements.orderModal.classList.remove('active');
    state.selectedService = null;
  }

  /**
   * WhatsApp Message Generator
   */
  function generateWhatsAppMessage() {
    if (!state.selectedService) return '';

    const s = state.selectedService;
    const qty = state.orderQuantity;
    const link = elements.orderLinkInput.value.trim() || 'سيتم إرساله في المحادثة';
    const totalUSD = calculateTotalOrderPrice(s, qty);
    const priceUSDFormatted = formatCurrency(totalUSD, 'USD');
    const priceLocalFormatted = formatCurrency(totalUSD, state.currentCurrency !== 'USD' ? state.currentCurrency : 'SDG');

    return `السلام عليكم ورحمة الله،
أود تقديم طلب جديد من موقع *${CONFIG.storeName} (${CONFIG.storeNameEn})*:

📋 *تفاصيل الطلب:*
━━━━━━━━━━━━━━━━━━━━
▪️ *الخدمة:* ${s.name}
▪️ *رقم الخدمة (ID):* #${s.id}
▪️ *المنصة:* ${s.platform_name}
▪️ *الضمان:* ${s.guarantee}
▪️ *الكمية المطلوبة:* ${qty.toLocaleString()}
▪️ *الرابط / الحساب:* ${link}
━━━━━━━━━━━━━━━━━━━━
💵 *إجمالي التكلفة:* ${priceUSDFormatted} [${priceLocalFormatted}]
━━━━━━━━━━━━━━━━━━━━
يرجى تزويدي بطريقة الدفع وتأكيد تنفيذ الطلب وشكراً.`;
  }

  function handleWhatsAppOrder() {
    if (!state.selectedService) return;

    const link = elements.orderLinkInput.value.trim();
    if (!link) {
      showToast('يرجى كتابة رابط الحساب أو المنشور المطلوب أولاً', 'error');
      elements.orderLinkInput.focus();
      return;
    }

    const message = generateWhatsAppMessage();
    const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
    showToast('جارٍ تحويلك للواتساب لإتمام طلبك...', 'success');
  }

  function handleCopyOrderDetails() {
    if (!state.selectedService) return;
    const message = generateWhatsAppMessage();
    navigator.clipboard.writeText(message).then(() => {
      showToast('تم نسخ تفاصيل الطلب بنجاح!', 'success');
    }).catch(() => {
      showToast('تعذر النسخ التلقائي', 'error');
    });
  }

  /**
   * Order Tracking Modal & Direct API Status Check
   */
  function openTrackModal() {
    elements.trackModal.classList.add('active');
    elements.trackOrderInput.focus();
  }

  function closeTrackModal() {
    elements.trackModal.classList.remove('active');
    elements.trackResultBox.style.display = 'none';
  }

  async function checkOrderStatus() {
    const orderNumber = elements.trackOrderInput.value.trim();
    if (!orderNumber) {
      showToast('يرجى إدخال رقم الطلب للاستعلام', 'error');
      elements.trackOrderInput.focus();
      return;
    }

    const btn = elements.submitTrackBtn;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ الفحص...';

    try {
      const url = `${CONFIG.api.baseUrl}?action=order_status&order_number=${encodeURIComponent(orderNumber)}&api_key=${encodeURIComponent(CONFIG.api.apiKey)}`;
      
      const response = await fetch(url);
      const data = await response.json();

      elements.trackResultBox.style.display = 'block';

      if (data && data.success) {
        let statusBadgeColor = 'background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981;';
        let statusText = data.status || 'قيد المعالجة';

        if (statusText.toLowerCase().includes('progress') || statusText.toLowerCase().includes('pending')) {
          statusBadgeColor = 'background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid #f59e0b;';
          statusText = 'قيد التنفيذ ⏳';
        } else if (statusText.toLowerCase().includes('completed')) {
          statusText = 'مكتمل بنجاح ✅';
        } else if (statusText.toLowerCase().includes('canceled')) {
          statusBadgeColor = 'background: rgba(244, 63, 94, 0.15); color: #f43f5e; border: 1px solid #f43f5e;';
          statusText = 'ملغي / تم إرجاع الرصيد ⚠️';
        }

        elements.trackResultBox.innerHTML = `
          <div style="text-align: right;">
            <span class="status-badge-live" style="${statusBadgeColor}">${statusText}</span>
            <h4 style="margin: 8px 0; font-size: 1.1rem; color: #fff;">الخدمة: ${data.service_name || 'خدمة رقمية'}</h4>
            <div style="font-size: 0.88rem; color: #94a3b8; display: grid; gap: 6px;">
              <div>رقم الطلب: <b style="color: #fff;">#${data.order_number}</b></div>
              <div>الكمية الإجمالية: <b style="color: #fff;">${(data.quantity || 0).toLocaleString()}</b></div>
              <div>المتبقي للتسليم: <b style="color: #00e5ff;">${(data.remains || 0).toLocaleString()}</b></div>
            </div>
          </div>
        `;
        showToast('تم جلب حالة الطلب بنجاح', 'success');
      } else {
        const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
        const msg = encodeURIComponent(`السلام عليكم، أستفسر عن حالة الطلب رقم: #${orderNumber}`);
        const waLink = `https://wa.me/${phone}?text=${msg}`;

        elements.trackResultBox.innerHTML = `
          <div style="color: var(--t1); text-align: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: var(--r2); border: 1px solid var(--b1);">
            <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--accent-cyan); margin-bottom: 10px;"></i>
            <p style="font-size: 0.9rem; margin-bottom: 12px;">تنبيه: يمكنك تتبع طلبك مباشرة عبر الدعم الفني بالضغط على الزر أدناه:</p>
            <a href="${waLink}" target="_blank" class="btn btn-whatsapp btn-sm" style="width: 100%; display: inline-flex;">
              <i class="fab fa-whatsapp"></i> استفسر عن الطلب #${orderNumber} عبر الواتساب
            </a>
          </div>
        `;
      }
    } catch (err) {
      const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(`السلام عليكم، أود التتبع والاستفسار عن الطلب رقم: #${orderNumber}`);
      const waLink = `https://wa.me/${phone}?text=${msg}`;

      elements.trackResultBox.style.display = 'block';
      elements.trackResultBox.innerHTML = `
        <div style="color: var(--t1); text-align: center; padding: 12px; background: rgba(255,255,255,0.03); border-radius: var(--r2); border: 1px solid var(--b1);">
          <i class="fab fa-whatsapp" style="font-size: 2.2rem; color: #25D366; margin-bottom: 10px;"></i>
          <p style="font-size: 0.9rem; margin-bottom: 12px;">تواصل مباشرة مع خدمة العملاء لمعرفة حالة الطلب:</p>
          <a href="${waLink}" target="_blank" class="btn btn-whatsapp btn-sm" style="width: 100%; display: inline-flex;">
            <i class="fab fa-whatsapp"></i> متابعة الطلب #${orderNumber} في واتساب
          </a>
        </div>
      `;
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }

  /**
   * Gemini Pro Promo Order Handler
   */
  function handleGeminiOrder() {
    // Calculate live price from services data (id 9999 = Gemini)
    const geminiService = SERVICES_DATA.find(s => s.id === 9999);
    const priceUSD = geminiService ? (getSellingPricePer1k(geminiService.base_price_1k) / 1000).toFixed(2) : '1.80';
    const priceLocal = geminiService ? formatCurrency(getSellingPricePer1k(geminiService.base_price_1k) / 1000) : `$${priceUSD}`;

    const message =
`السلام عليكم،
أود طلب اشتراك *Google Gemini Pro (18 شهر)* من متجر *${CONFIG.storeName}*:

📋 *تفاصيل الطلب:*
━━━━━━━━━━━━━━━━━━━━
▪️ *المنتج:* Google Gemini Pro Advanced
▪️ *المدة:* 18 شهر رسمي
▪️ *السعر:* ${priceLocal}
━━━━━━━━━━━━━━━━━━━━
يرجى تزويدي بطريقة الدفع لإتمام التفعيل.`;

    const phone = CONFIG.whatsappNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  }

  /**
   * Event Listeners Setup
   */
  function setupEventListeners() {
    // Search with debounce
    let searchTimeout;
    elements.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      state.searchQuery = e.target.value;
      elements.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
      searchTimeout = setTimeout(() => {
        state.currentPage = 1;
        applyFilters();
      }, 250);
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      state.searchQuery = '';
      elements.clearSearchBtn.style.display = 'none';
      state.currentPage = 1;
      applyFilters();
      elements.searchInput.focus();
    });

    // Sorting
    elements.servicesSort.addEventListener('change', (e) => {
      state.selectedSort = e.target.value;
      state.currentPage = 1;
      applyFilters();
    });

    // Currency Switcher
    elements.currencySelect.addEventListener('change', (e) => {
      state.currentCurrency = e.target.value;
      renderServices();
      if (state.selectedService) updateOrderCalculation();

      // Update Gemini banner price
      const geminiPriceDisplay = document.getElementById('geminiPriceDisplay');
      if (geminiPriceDisplay) {
        const geminiService = SERVICES_DATA.find(s => s.id === 9999);
        const price = geminiService ? formatCurrency(getSellingPricePer1k(geminiService.base_price_1k) / 1000) : `$1.80`;
        geminiPriceDisplay.innerHTML = `${price} <small style="font-size: 0.8rem; font-weight: normal; opacity: 0.8;">فقط</small>`;
      }

      showToast(`تم تحويل العملة إلى: ${CONFIG.currency.rates[state.currentCurrency].name}`, 'info');
    });

    // Load More
    elements.loadMoreBtn.addEventListener('click', () => {
      state.currentPage++;
      renderServices();
    });

    // Quantity Input / Slider Sync
    elements.orderQtyInput.addEventListener('input', () => {
      elements.orderQtySlider.value = elements.orderQtyInput.value;
      updateOrderCalculation();
    });

    elements.orderQtySlider.addEventListener('input', () => {
      elements.orderQtyInput.value = elements.orderQtySlider.value;
      updateOrderCalculation();
    });

    // Quick Step Quantity Buttons
    document.querySelectorAll('.quick-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!state.selectedService) return;
        if (btn.dataset.action === 'max') {
          elements.orderQtyInput.value = state.selectedService.max;
        } else {
          const add = parseInt(btn.dataset.qty, 10) || 0;
          let current = parseInt(elements.orderQtyInput.value, 10) || state.selectedService.min;
          elements.orderQtyInput.value = Math.min(state.selectedService.max, current + add);
        }
        elements.orderQtySlider.value = elements.orderQtyInput.value;
        updateOrderCalculation();
      });
    });

    // Modal Actions
    elements.whatsappOrderBtn.addEventListener('click', handleWhatsAppOrder);
    elements.copyOrderBtn.addEventListener('click', handleCopyOrderDetails);
    elements.closeOrderModalBtn.addEventListener('click', closeOrderModal);

    // Track Modal Actions
    elements.trackOrderBtn.addEventListener('click', openTrackModal);
    if (elements.mobileTrackBtn) elements.mobileTrackBtn.addEventListener('click', openTrackModal);
    elements.closeTrackModalBtn.addEventListener('click', closeTrackModal);
    elements.submitTrackBtn.addEventListener('click', checkOrderStatus);
    elements.trackOrderInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkOrderStatus();
    });

    // Gemini Banner
    if (elements.geminiOrderBtn) {
      elements.geminiOrderBtn.addEventListener('click', handleGeminiOrder);
    }

    // Close Modals on Overlay Click
    window.addEventListener('click', (e) => {
      if (e.target === elements.orderModal) closeOrderModal();
      if (e.target === elements.trackModal) closeTrackModal();
      if (e.target === elements.detailsModal) closeDetailsModal();
    });

    if (elements.closeDetailsModalBtn) {
      elements.closeDetailsModalBtn.addEventListener('click', closeDetailsModal);
    }

    // Close Modals on ESC Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeOrderModal();
        closeTrackModal();
        closeDetailsModal();
      }
    });
  }

  /**
   * App Initialization
   */
  function init() {
    initPlatformCards();
    updateSubTypesBar();
    applyFilters();
    setupEventListeners();

    // Initialize Ticker Bar
    if (CONFIG.announcement && CONFIG.announcement.enabled && elements.tickerBar) {
      if (elements.tickerContent) elements.tickerContent.textContent = CONFIG.announcement.text;
      elements.tickerBar.style.display = 'block';
      if (elements.tickerCloseBtn) {
        elements.tickerCloseBtn.addEventListener('click', () => {
          elements.tickerBar.style.display = 'none';
        });
      }
    }

    // Initialize Gemini banner price
    const geminiPriceDisplay = document.getElementById('geminiPriceDisplay');
    if (geminiPriceDisplay) {
      const geminiService = SERVICES_DATA.find(s => s.id === 9999);
      const price = geminiService ? formatCurrency(getSellingPricePer1k(geminiService.base_price_1k) / 1000) : `$1.80`;
      geminiPriceDisplay.innerHTML = `${price} <small style="font-size: 0.8rem; font-weight: normal; opacity: 0.8;">فقط</small>`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
