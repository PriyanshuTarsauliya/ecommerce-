/**
 * NOURA. Luxury E-Commerce Application Logic
 * Implements high-end interactions: look crossfading, bag switcher,
 * product spotlight configurator, cart drawer, wishlist, and search.
 */

// State Management
const state = {
  activeLookIndex: 0,
  activeColor: 'noir',
  activeSize: 'small',
  activePrice: 590,
  activeQty: 1,
  activeStageView: 'model', // 'model' or 'product'
  cart: [],
  wishlist: new Set(),
  currency: 'USD',
  currencyRate: 1.0,
  currencySymbol: '$'
};

// Catalog Database
const catalog = {
  turismo: {
    id: 'turismo',
    title: 'The small Turismo',
    category: 'Leather Goods',
    basePrice: 590,
    colors: {
      noir: {
        name: 'Noir Classic',
        modelImg: './assets/hero_black_dress.jpg',
        stillImg: './assets/bag_black.jpg',
        hex: '#1A1A1A'
      },
      sienna: {
        name: 'Sienna Raw',
        modelImg: './assets/hero_brown_coat.jpg',
        stillImg: './assets/hero_brown_coat.jpg',
        hex: '#6A381F'
      },
      blush: {
        name: 'Blush Rose',
        modelImg: './assets/hero_pink_look.jpg',
        stillImg: './assets/bag_pink.jpg',
        hex: '#D8A49B'
      },
      limoncello: {
        name: 'Limoncello Yellow',
        modelImg: './assets/social_yellow_dress.jpg',
        stillImg: './assets/bag_yellow.jpg',
        hex: '#E2BF42'
      },
      alabaster: {
        name: 'Alabaster Bone',
        modelImg: './assets/hero_pink_look.jpg',
        stillImg: './assets/bag_pink.jpg',
        hex: '#E6E1D7'
      }
    },
    sizes: {
      mini: { name: 'Mini', dim: '20 cm', price: 520 },
      small: { name: 'Small', dim: '26 cm', price: 590 },
      medium: { name: 'Medium', dim: '32 cm', price: 680 }
    }
  },
  looks: [
    {
      index: '01',
      title: 'Sienna Tailored Coat',
      img: './assets/hero_brown_coat.jpg',
      bagKey: 'sienna',
      cardId: null
    },
    {
      index: '02',
      title: 'Noir Backless Silk',
      img: './assets/hero_black_dress.jpg',
      bagKey: 'noir',
      cardId: 'noir'
    },
    {
      index: '03',
      title: 'Blush Riviera Linen',
      img: './assets/hero_pink_look.jpg',
      bagKey: 'blush',
      cardId: 'blush'
    },
    {
      index: '04',
      title: 'Limoncello Sunlight',
      img: './assets/social_yellow_dress.jpg',
      bagKey: 'limoncello',
      cardId: 'limoncello'
    }
  ],
  companionItems: {
    'item-jacket': {
      id: 'item-jacket',
      name: 'Ovallo jacket',
      category: 'Outerwear',
      price: 990,
      img: './assets/item_jacket.jpg',
      desc: 'Architectural sculpted wool jacket with asymmetrical notched lapel and structured waistline. Tailored in Milan from virgin double-faced wool.'
    },
    'item-earrings': {
      id: 'item-earrings',
      name: 'Care earings',
      category: 'Fine Jewelry',
      price: 250,
      img: './assets/item_earrings.jpg',
      desc: 'Sculptural hoop earrings cast in recycled 925 sterling silver with a thick 24k yellow gold vermeil finish. Hypoallergenic titanium posts.'
    },
    'item-pants': {
      id: 'item-pants',
      name: 'Ovallo pants',
      category: 'Tailoring',
      price: 790,
      img: './assets/item_pants.jpg',
      desc: 'Fluid high-waisted wide-leg trousers designed with clean pressed pleats and concealed closure. Crafted from sustainable Italian wool-crepe.'
    },
    'item-heels': {
      id: 'item-heels',
      name: 'High cubisto',
      category: 'Footwear',
      price: 750,
      img: './assets/item_heels.jpg',
      desc: 'Sharp pointed-toe slingback stiletto crafted from polished Italian box-calf leather. 85mm architectural sculptural heel.'
    }
  }
};

// DOM Elements
const dom = {
  // Hero
  heroActiveImg: document.getElementById('heroActiveImage'),
  lookCurrentIndex: document.getElementById('lookCurrentIndex'),
  lookCurrentTitle: document.getElementById('lookCurrentTitle'),
  lookThumbBtns: document.querySelectorAll('.look-thumb-btn'),
  heroBagCards: document.querySelectorAll('.hero-bag-card'),
  heroShopBtn: document.getElementById('heroShopBtn'),

  // Spotlight
  spotlightMainImg: document.getElementById('spotlightMainImg'),
  spotlightPriceDisplay: document.getElementById('spotlightPriceDisplay'),
  selectedColorName: document.getElementById('selectedColorName'),
  swatchBtns: document.querySelectorAll('.swatch-btn'),
  sizePillBtns: document.querySelectorAll('.size-pill-btn'),
  stageToggleBtns: document.querySelectorAll('.stage-toggle-btn'),
  qtyMinus: document.getElementById('qtyMinus'),
  qtyPlus: document.getElementById('qtyPlus'),
  qtyVal: document.getElementById('qtyVal'),
  btnPriceLabel: document.getElementById('btnPriceLabel'),
  addTurismoToCartBtn: document.getElementById('addTurismoToCartBtn'),
  expressBuyBtn: document.getElementById('expressBuyBtn'),
  accordionTriggers: document.querySelectorAll('.accordion-trigger'),

  // Header & Counters
  cartCount: document.getElementById('cartCount'),
  wishlistCount: document.getElementById('wishlistCount'),
  openCartBtn: document.getElementById('openCartBtn'),
  openWishlistBtn: document.getElementById('openWishlistBtn'),
  openSearchBtn: document.getElementById('openSearchBtn'),
  openAccountBtn: document.getElementById('openAccountBtn'),
  mobileMenuBtn: document.getElementById('mobileMenuBtn'),

  // Drawers & Modals
  cartDrawerOverlay: document.getElementById('cartDrawerOverlay'),
  closeCartBtn: document.getElementById('closeCartBtn'),
  cartItemsList: document.getElementById('cartItemsList'),
  drawerCartCount: document.getElementById('drawerCartCount'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  shippingMeterFill: document.getElementById('shippingMeterFill'),
  shippingMeterText: document.getElementById('shippingMeterText'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  emptyCartShopBtn: document.getElementById('emptyCartShopBtn'),

  wishlistOverlay: document.getElementById('wishlistOverlay'),
  closeWishlistBtn: document.getElementById('closeWishlistBtn'),
  wishlistItemsList: document.getElementById('wishlistItemsList'),
  drawerWishlistCount: document.getElementById('drawerWishlistCount'),

  searchOverlay: document.getElementById('searchOverlay'),
  closeSearchBtn: document.getElementById('closeSearchBtn'),
  searchInput: document.getElementById('searchInput'),
  searchResultsList: document.getElementById('searchResultsList'),
  quickTagBtns: document.querySelectorAll('.quick-tag-btn'),

  sizeModalOverlay: document.getElementById('sizeModalOverlay'),
  openSizeGuideBtn: document.getElementById('openSizeGuideBtn'),
  closeSizeModalBtn: document.getElementById('closeSizeModalBtn'),

  quickViewOverlay: document.getElementById('quickViewOverlay'),
  closeQuickViewBtn: document.getElementById('closeQuickViewBtn'),
  quickViewContent: document.getElementById('quickViewContent'),

  // Newsletter
  newsletterForm: document.getElementById('newsletterForm'),
  newsletterEmail: document.getElementById('newsletterEmail'),
  newsletterFeedback: document.getElementById('newsletterFeedback'),

  // Currency
  currencySelect: document.getElementById('currencySelect'),
  toastContainer: document.getElementById('toastContainer')
};

// ==========================================================================
// 1. HERO LOOK SWITCHER & BAG CARDS
// ==========================================================================

function switchHeroLook(index) {
  if (index < 0 || index >= catalog.looks.length) return;
  state.activeLookIndex = index;
  const look = catalog.looks[index];

  // Crossfade hero image
  dom.heroActiveImg.style.opacity = '0.3';
  setTimeout(() => {
    dom.heroActiveImg.src = look.img;
    dom.heroActiveImg.style.opacity = '1';
  }, 150);

  // Update Look Badge
  dom.lookCurrentIndex.textContent = look.index;
  dom.lookCurrentTitle.textContent = look.title;

  // Update Thumbnail pills
  dom.lookThumbBtns.forEach((btn, i) => {
    const isActive = i === index;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update Hero Bag Cards active state
  dom.heroBagCards.forEach(card => {
    const bagKey = card.dataset.bag;
    const isMatching = bagKey === look.bagKey;
    card.classList.toggle('active', isMatching);
    const hint = card.querySelector('.card-hover-hint');
    if (hint) {
      hint.textContent = isMatching ? 'Active Look' : 'Select Look';
    }
  });

  // Sync color swatch in Spotlight
  if (look.bagKey && catalog.turismo.colors[look.bagKey]) {
    setColor(look.bagKey);
  }
}

function initHeroInteractions() {
  // Thumbnail buttons
  dom.lookThumbBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => switchHeroLook(i));
  });

  // 3 Bag Cards in hero
  dom.heroBagCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Avoid triggering when clicking wishlist button inside
      if (e.target.closest('.card-wishlist-btn')) return;
      const lookIdx = parseInt(card.dataset.look, 10);
      switchHeroLook(lookIdx);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const lookIdx = parseInt(card.dataset.look, 10);
        switchHeroLook(lookIdx);
      }
    });
  });

  // Wishlist buttons in Hero cards
  document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemId = btn.dataset.itemId;
      toggleWishlist(itemId, btn);
    });
  });
}

// ==========================================================================
// 2. PRODUCT SPOTLIGHT: The Small Turismo Configurator
// ==========================================================================

function setColor(colorKey) {
  if (!catalog.turismo.colors[colorKey]) return;
  state.activeColor = colorKey;
  const colorData = catalog.turismo.colors[colorKey];

  // Update name
  dom.selectedColorName.textContent = colorData.name;

  // Update Swatch buttons
  dom.swatchBtns.forEach(btn => {
    const isSelected = btn.dataset.color === colorKey;
    btn.classList.toggle('active', isSelected);
    btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
  });

  // Update center stage image based on view mode
  updateSpotlightImage();
}

function updateSpotlightImage() {
  const colorData = catalog.turismo.colors[state.activeColor];
  const targetSrc = state.activeStageView === 'model' ? colorData.modelImg : colorData.stillImg;

  dom.spotlightMainImg.style.opacity = '0.4';
  setTimeout(() => {
    dom.spotlightMainImg.src = targetSrc;
    dom.spotlightMainImg.style.opacity = '1';
  }, 120);
}

function setSize(sizeKey) {
  if (!catalog.turismo.sizes[sizeKey]) return;
  state.activeSize = sizeKey;
  const sizeData = catalog.turismo.sizes[sizeKey];
  state.activePrice = sizeData.price;

  // Update Size pills
  dom.sizePillBtns.forEach(btn => {
    const isSelected = btn.dataset.size === sizeKey;
    btn.classList.toggle('active', isSelected);
    btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
  });

  // Update Prices
  const formatted = formatCurrency(state.activePrice);
  dom.spotlightPriceDisplay.textContent = formatted;
  dom.btnPriceLabel.textContent = formatted;
}

function initSpotlightInteractions() {
  // Swatches
  dom.swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      setColor(color);
      // Also update hero look if matching
      const matchingLookIndex = catalog.looks.findIndex(l => l.bagKey === color);
      if (matchingLookIndex !== -1) {
        state.activeLookIndex = matchingLookIndex;
        const look = catalog.looks[matchingLookIndex];
        dom.heroActiveImg.src = look.img;
        dom.lookCurrentIndex.textContent = look.index;
        dom.lookCurrentTitle.textContent = look.title;
        dom.lookThumbBtns.forEach((b, i) => b.classList.toggle('active', i === matchingLookIndex));
        dom.heroBagCards.forEach(c => c.classList.toggle('active', c.dataset.bag === color));
      }
    });
  });

  // Size pills
  dom.sizePillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setSize(btn.dataset.size);
    });
  });

  // Stage view toggles (Editorial View vs Product Still)
  dom.stageToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.stageToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeStageView = btn.dataset.view;
      updateSpotlightImage();
    });
  });

  // Quantity stepper
  dom.qtyMinus.addEventListener('click', () => {
    if (state.activeQty > 1) {
      state.activeQty--;
      dom.qtyVal.textContent = state.activeQty;
    }
  });

  dom.qtyPlus.addEventListener('click', () => {
    if (state.activeQty < 10) {
      state.activeQty++;
      dom.qtyVal.textContent = state.activeQty;
    }
  });

  // Accordion Expand / Collapse
  dom.accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const icon = trigger.querySelector('.accordion-icon');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        content.hidden = true;
        item.classList.remove('open');
        icon.textContent = '+';
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        content.hidden = false;
        item.classList.add('open');
        icon.textContent = '−';
      }
    });
  });

  // Primary Add Turismo to Cart
  dom.addTurismoToCartBtn.addEventListener('click', () => {
    const colorInfo = catalog.turismo.colors[state.activeColor];
    const sizeInfo = catalog.turismo.sizes[state.activeSize];

    addToCart({
      id: `turismo-${state.activeColor}-${state.activeSize}`,
      name: `The small Turismo (${sizeInfo.name})`,
      variant: `${colorInfo.name} • ${sizeInfo.dim}`,
      price: state.activePrice,
      img: colorInfo.stillImg || colorInfo.modelImg,
      qty: state.activeQty
    });

    showToast(`Added ${state.activeQty}x The small Turismo (${colorInfo.name}) to your bag`);
    openCart();
  });

  // Express buy
  dom.expressBuyBtn.addEventListener('click', () => {
    showToast('Redirecting to Secure Atelier Concierge Checkout...');
    setTimeout(() => {
      openCart();
    }, 600);
  });
}

// ==========================================================================
// 3. COMPLETE THE LOOK & QUICK ACTIONS
// ==========================================================================

function initCompanionInteractions() {
  // Quick Add buttons
  document.querySelectorAll('.btn-quick-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const item = catalog.companionItems[id];
      if (!item) return;

      addToCart({
        id: item.id,
        name: item.name,
        variant: item.category,
        price: item.price,
        img: item.img,
        qty: 1
      });

      showToast(`Added ${item.name} to your bag`);
      openCart();
    });
  });

  // Quick View buttons
  document.querySelectorAll('.btn-quick-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      openQuickView(id);
    });
  });
}

function openQuickView(itemId) {
  const item = catalog.companionItems[itemId];
  if (!item) return;

  dom.quickViewContent.innerHTML = `
    <div class="quick-view-grid">
      <div class="qv-img-box">
        <img src="${item.img}" alt="${item.name}">
      </div>
      <div class="qv-details">
        <span class="product-category">${item.category}</span>
        <h3 class="spotlight-title" style="font-size: 2rem;">${item.name}</h3>
        <div class="spotlight-price">${formatCurrency(item.price)}</div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7;">${item.desc}</p>
        <button class="btn-luxury-primary" id="qvAddToCartBtn" style="margin-top: 1rem;">
          Add to Cart • ${formatCurrency(item.price)}
        </button>
      </div>
    </div>
  `;

  document.getElementById('qvAddToCartBtn').addEventListener('click', () => {
    addToCart({
      id: item.id,
      name: item.name,
      variant: item.category,
      price: item.price,
      img: item.img,
      qty: 1
    });
    closeQuickView();
    showToast(`Added ${item.name} to your bag`);
    openCart();
  });

  dom.quickViewOverlay.classList.add('open');
  dom.quickViewOverlay.setAttribute('aria-hidden', 'false');
}

function closeQuickView() {
  dom.quickViewOverlay.classList.remove('open');
  dom.quickViewOverlay.setAttribute('aria-hidden', 'true');
}

// ==========================================================================
// 4. CART & WISHLIST MANAGEMENT
// ==========================================================================

function addToCart(item) {
  const existing = state.cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += item.qty;
  } else {
    state.cart.push({ ...item });
  }
  updateCartUI();
}

function updateCartQty(id, delta) {
  const index = state.cart.findIndex(i => i.id === id);
  if (index === -1) return;

  state.cart[index].qty += delta;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
  }
  updateCartUI();
}

function removeCartItem(id) {
  state.cart = state.cart.filter(i => i.id !== id);
  updateCartUI();
  showToast('Item removed from shopping bag');
}

function updateCartUI() {
  const totalItems = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  // Update counters
  dom.cartCount.textContent = totalItems;
  dom.drawerCartCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;

  // Update free shipping meter ($400 threshold)
  const freeThreshold = 400;
  if (subtotal >= freeThreshold) {
    dom.shippingMeterFill.style.width = '100%';
    dom.shippingMeterText.textContent = '✓ You qualify for complimentary White-Glove Delivery';
  } else {
    const remaining = freeThreshold - subtotal;
    const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
    dom.shippingMeterFill.style.width = `${pct}%`;
    dom.shippingMeterText.textContent = `Add ${formatCurrency(remaining)} for complimentary express delivery`;
  }

  // Update subtotal
  dom.cartSubtotal.textContent = formatCurrency(subtotal);

  // Render items
  if (state.cart.length === 0) {
    dom.cartItemsList.innerHTML = `
      <div class="empty-cart-message">
        <p>Your shopping bag is currently empty.</p>
        <button class="btn-empty-shop" id="emptyCartShopBtn">Explore The Small Turismo</button>
      </div>
    `;
    const btn = document.getElementById('emptyCartShopBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        closeCart();
        const target = document.getElementById('turismo-spotlight');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    }
  } else {
    dom.cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-line-item">
        <div class="cart-line-thumb">
          <img src="${item.img}" alt="${item.name}">
        </div>
        <div class="cart-line-details">
          <h4 class="cart-line-name">${item.name}</h4>
          <span class="cart-line-meta">${item.variant}</span>
          <div class="cart-line-qty">
            <button class="qty-btn-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-line-price-box">
          <span class="cart-line-price">${formatCurrency(item.price * item.qty)}</span>
          <button class="cart-line-remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join('');

    // Attach listeners
    dom.cartItemsList.querySelectorAll('.qty-btn-minus').forEach(b => {
      b.addEventListener('click', () => updateCartQty(b.dataset.id, -1));
    });
    dom.cartItemsList.querySelectorAll('.qty-btn-plus').forEach(b => {
      b.addEventListener('click', () => updateCartQty(b.dataset.id, 1));
    });
    dom.cartItemsList.querySelectorAll('.cart-line-remove').forEach(b => {
      b.addEventListener('click', () => removeCartItem(b.dataset.id));
    });
  }
}

function openCart() {
  dom.cartDrawerOverlay.classList.add('open');
  dom.cartDrawerOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  dom.cartDrawerOverlay.classList.remove('open');
  dom.cartDrawerOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Wishlist handling
function toggleWishlist(itemId, btnElement) {
  if (state.wishlist.has(itemId)) {
    state.wishlist.delete(itemId);
    if (btnElement) btnElement.classList.remove('active');
    showToast('Piece removed from your wishlist');
  } else {
    state.wishlist.add(itemId);
    if (btnElement) btnElement.classList.add('active');
    showToast('Piece saved to your wishlist');
  }

  // Update badges
  dom.wishlistCount.textContent = state.wishlist.size;
  dom.drawerWishlistCount.textContent = `${state.wishlist.size} pieces`;
  renderWishlistItems();
}

function renderWishlistItems() {
  if (state.wishlist.size === 0) {
    dom.wishlistItemsList.innerHTML = `
      <div class="empty-cart-message">
        <p>Your wishlist is currently empty.</p>
        <p class="empty-subtext">Click the heart icon on any piece to save it for later.</p>
      </div>
    `;
    return;
  }

  const items = Array.from(state.wishlist).map(id => {
    if (id === 'bag-yellow') return { id, name: 'The small Turismo (Limoncello)', price: 590, img: './assets/bag_yellow.jpg' };
    if (id === 'bag-black') return { id, name: 'The small Turismo (Noir Classic)', price: 590, img: './assets/bag_black.jpg' };
    if (id === 'bag-pink') return { id, name: 'The small Turismo (Blush Rose)', price: 590, img: './assets/bag_pink.jpg' };
    return catalog.companionItems[id] || null;
  }).filter(Boolean);

  dom.wishlistItemsList.innerHTML = items.map(item => `
    <div class="cart-line-item">
      <div class="cart-line-thumb">
        <img src="${item.img}" alt="${item.name}">
      </div>
      <div class="cart-line-details">
        <h4 class="cart-line-name">${item.name}</h4>
        <span class="cart-line-price">${formatCurrency(item.price)}</span>
        <button class="btn-quick-add" style="margin-top: 0.5rem; width: fit-content; padding: 0.4rem 0.8rem;" data-id="${item.id}">
          Move to Bag
        </button>
      </div>
      <div class="cart-line-price-box">
        <button class="cart-line-remove" data-id="${item.id}">Remove</button>
      </div>
    </div>
  `).join('');

  dom.wishlistItemsList.querySelectorAll('.btn-quick-add').forEach(b => {
    b.addEventListener('click', () => {
      const it = items.find(x => x.id === b.dataset.id);
      if (it) {
        addToCart({
          id: it.id,
          name: it.name,
          variant: 'Wishlist Selection',
          price: it.price,
          img: it.img,
          qty: 1
        });
        state.wishlist.delete(it.id);
        toggleWishlist(it.id);
        closeWishlist();
        openCart();
      }
    });
  });

  dom.wishlistItemsList.querySelectorAll('.cart-line-remove').forEach(b => {
    b.addEventListener('click', () => {
      toggleWishlist(b.dataset.id);
    });
  });
}

function openWishlist() {
  dom.wishlistOverlay.classList.add('open');
  dom.wishlistOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeWishlist() {
  dom.wishlistOverlay.classList.remove('open');
  dom.wishlistOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ==========================================================================
// 5. SEARCH MODAL & CATALOG FILTERING
// ==========================================================================

function initSearch() {
  dom.openSearchBtn.addEventListener('click', () => {
    dom.searchOverlay.classList.add('open');
    dom.searchOverlay.setAttribute('aria-hidden', 'false');
    dom.searchInput.value = '';
    dom.searchResultsList.innerHTML = '';
    setTimeout(() => dom.searchInput.focus(), 100);
  });

  dom.closeSearchBtn.addEventListener('click', closeSearch);
  dom.searchOverlay.addEventListener('click', (e) => {
    if (e.target === dom.searchOverlay) closeSearch();
  });

  dom.quickTagBtns.forEach(b => {
    b.addEventListener('click', () => {
      dom.searchInput.value = b.dataset.search;
      performSearch(b.dataset.search);
    });
  });

  dom.searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value.trim());
  });
}

function closeSearch() {
  dom.searchOverlay.classList.remove('open');
  dom.searchOverlay.setAttribute('aria-hidden', 'true');
}

function performSearch(query) {
  if (!query) {
    dom.searchResultsList.innerHTML = '';
    return;
  }

  const q = query.toLowerCase();
  const allItems = [
    { name: 'The small Turismo (Handbag)', category: 'Leather Goods', price: 590, img: './assets/bag_black.jpg', target: '#turismo-spotlight' },
    { name: 'Ovallo jacket', category: 'Outerwear', price: 990, img: './assets/item_jacket.jpg', target: '#complete-the-look' },
    { name: 'Care earings', category: 'Fine Jewelry', price: 250, img: './assets/item_earrings.jpg', target: '#complete-the-look' },
    { name: 'Ovallo pants', category: 'Tailoring', price: 790, img: './assets/item_pants.jpg', target: '#complete-the-look' },
    { name: 'High cubisto', category: 'Footwear', price: 750, img: './assets/item_heels.jpg', target: '#complete-the-look' }
  ];

  const results = allItems.filter(item => 
    item.name.toLowerCase().includes(q) || 
    item.category.toLowerCase().includes(q)
  );

  if (results.length === 0) {
    dom.searchResultsList.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-muted); padding: 1rem 0;">No atelier pieces found matching "${query}".</p>`;
    return;
  }

  dom.searchResultsList.innerHTML = results.map(item => `
    <div class="search-result-item" data-target="${item.target}">
      <img src="${item.img}" alt="${item.name}" class="search-result-thumb">
      <div>
        <h4 style="font-family: var(--font-serif); font-size: 1.15rem;">${item.name}</h4>
        <span style="font-size: 0.75rem; color: var(--text-muted);">${item.category} • ${formatCurrency(item.price)}</span>
      </div>
    </div>
  `).join('');

  dom.searchResultsList.querySelectorAll('.search-result-item').forEach(el => {
    el.addEventListener('click', () => {
      closeSearch();
      const target = document.querySelector(el.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ==========================================================================
// 6. UTILITIES: TOASTS, CURRENCY, NEWSLETTER
// ==========================================================================

function formatCurrency(amount) {
  const converted = amount * state.currencyRate;
  if (state.currency === 'JPY') {
    return `¥ ${Math.round(converted).toLocaleString()}`;
  }
  if (state.currency === 'EUR') {
    return `€ ${Math.round(converted).toLocaleString()}`;
  }
  if (state.currency === 'GBP') {
    return `£ ${Math.round(converted).toLocaleString()}`;
  }
  return `$ ${Math.round(converted).toLocaleString()}`;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function initNewsletter() {
  dom.newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = dom.newsletterEmail.value.trim();
    if (!email || !email.includes('@')) {
      dom.newsletterFeedback.textContent = 'Please provide a valid email address.';
      dom.newsletterFeedback.className = 'newsletter-feedback error';
      return;
    }

    dom.newsletterFeedback.textContent = 'Thank you for joining. A private welcome note has been sent to your inbox.';
    dom.newsletterFeedback.className = 'newsletter-feedback success';
    dom.newsletterEmail.value = '';
    showToast('Subscribed to NOURA Atelier notes');
  });
}

function initCurrencySwitcher() {
  const rates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 152.0
  };

  dom.currencySelect.addEventListener('change', (e) => {
    const code = e.target.value;
    state.currency = code;
    state.currencyRate = rates[code] || 1.0;
    setSize(state.activeSize);
    updateCartUI();
    showToast(`Currency updated to ${code}`);
  });
}

// Global modal overlays closing on backdrop & ESC
function initGlobalModals() {
  // Cart Drawer
  dom.openCartBtn.addEventListener('click', openCart);
  dom.closeCartBtn.addEventListener('click', closeCart);
  dom.cartDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === dom.cartDrawerOverlay) closeCart();
  });
  dom.checkoutBtn.addEventListener('click', () => {
    if (state.cart.length === 0) {
      showToast('Your bag is currently empty.');
      return;
    }
    showToast('Connecting to Florence Atelier Encrypted Gateway...');
  });

  // Wishlist Drawer
  dom.openWishlistBtn.addEventListener('click', openWishlist);
  dom.closeWishlistBtn.addEventListener('click', closeWishlist);
  dom.wishlistOverlay.addEventListener('click', (e) => {
    if (e.target === dom.wishlistOverlay) closeWishlist();
  });

  // Size Modal
  dom.openSizeGuideBtn.addEventListener('click', () => {
    dom.sizeModalOverlay.classList.add('open');
    dom.sizeModalOverlay.setAttribute('aria-hidden', 'false');
  });
  dom.closeSizeModalBtn.addEventListener('click', () => {
    dom.sizeModalOverlay.classList.remove('open');
    dom.sizeModalOverlay.setAttribute('aria-hidden', 'true');
  });
  dom.sizeModalOverlay.addEventListener('click', (e) => {
    if (e.target === dom.sizeModalOverlay) {
      dom.sizeModalOverlay.classList.remove('open');
      dom.sizeModalOverlay.setAttribute('aria-hidden', 'true');
    }
  });

  // Quick View Modal
  dom.closeQuickViewBtn.addEventListener('click', closeQuickView);
  dom.quickViewOverlay.addEventListener('click', (e) => {
    if (e.target === dom.quickViewOverlay) closeQuickView();
  });

  // Account mock
  dom.openAccountBtn.addEventListener('click', () => {
    showToast('NOURA Client Portal: Logged in as VIP Atelier Patron');
  });

  // Mobile menu button
  dom.mobileMenuBtn.addEventListener('click', () => {
    const nav = document.getElementById('mainNav');
    if (nav.style.display === 'block') {
      nav.style.display = '';
    } else {
      nav.style.display = 'block';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.backgroundColor = 'var(--bg-primary)';
      nav.style.padding = '1.5rem';
      nav.style.borderBottom = '1px solid var(--border-subtle)';
    }
  });

  // Escape key closes open overlay
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeWishlist();
      closeSearch();
      closeQuickView();
      dom.sizeModalOverlay.classList.remove('open');
      dom.sizeModalOverlay.setAttribute('aria-hidden', 'true');
    }
  });
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeroInteractions();
  initSpotlightInteractions();
  initCompanionInteractions();
  initSearch();
  initNewsletter();
  initCurrencySwitcher();
  initGlobalModals();
  updateCartUI();

  // Set initial Look 0 (Sienna Coat)
  switchHeroLook(0);
});
