import { getCartCount, getCartTotals } from './cart.js';
import { getFilteredProducts, getUniqueCategories, isGridMode, splitProductsIntoSections } from './filters.js';
import { DEFAULT_MAX_PRICE, state, applyFilterSelection, setSearchTerm } from './state.js';

const currency = value => `\u20b9${value.toFixed(2)}`;

export function renderSkeletons() {
  document.querySelectorAll('.scroll-section').forEach(section => {
    section.innerHTML = Array.from({ length: 4 }, () => `
      <div class="product-card skeleton-card">
        <div class="skeleton-box skeleton-img"></div>
        <div class="skeleton-info">
          <div class="skeleton-box skeleton-title"></div>
          <div class="skeleton-box skeleton-subtitle"></div>
          <div class="skeleton-bottom">
            <div class="skeleton-box skeleton-price"></div>
            <div class="skeleton-box skeleton-btn"></div>
          </div>
        </div>
      </div>
    `).join('');
  });
}

export function renderErrorState(onRetry) {
  const sections = document.querySelectorAll('.section-header');
  const scrollSections = document.querySelectorAll('.scroll-section');

  sections.forEach(section => {
    section.style.display = 'none';
  });

  scrollSections.forEach((section, index) => {
    section.innerHTML = index === 0 ? `
      <div class="error-state">
        <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <div class="error-title">Failed to load menu</div>
        <div class="error-desc">We couldn't connect to our servers. Please check your connection and try again.</div>
        <button class="retry-btn" type="button">Try Again</button>
      </div>
    ` : '';
  });

  document.querySelector('.retry-btn')?.addEventListener('click', onRetry);
}

export function renderCategoryOptions() {
  const categories = getUniqueCategories();
  const categoryContent = document.querySelector('.category-overlay .category-content');

  if (!categoryContent) return;

  categoryContent.querySelectorAll('.category-option').forEach(option => option.remove());
  categories.forEach(category => {
    const option = document.createElement('div');
    option.className = 'category-option';
    option.textContent = category;
    categoryContent.appendChild(option);
  });
}

export function renderTags(onSelectCategory) {
  const tagContainer = document.getElementById('tag-container');
  if (!tagContainer) return;

  tagContainer.innerHTML = '';

  const allTag = document.createElement('div');
  allTag.className = 'tag';
  allTag.textContent = 'Offers';
  allTag.dataset.category = 'all';
  tagContainer.appendChild(allTag);

  getUniqueCategories().forEach(category => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = category;
    tag.dataset.category = category;
    tagContainer.appendChild(tag);
  });

  tagContainer.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => onSelectCategory(tag.dataset.category));
  });

  updateTagHighlight();
}

export function updateTagHighlight() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.classList.remove('active');

    const category = tag.dataset.category;
    const isAllActive = state.selectedCategory === null
      && state.selectedFilterCategory === null
      && category === 'all';
    const isCategoryActive = state.selectedCategory === category
      || state.selectedFilterCategory === category;

    if (isAllActive || isCategoryActive) {
      tag.classList.add('active');
      tag.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  });
}

function renderCartControl(productId) {
  const qty = state.cart[productId] || 0;

  if (qty > 0) {
    return `
      <div class="cart-control-wrapper">
        <div class="qty-selector">
          <button class="qty-btn qty-minus" data-id="${productId}" type="button">-</button>
          <div class="qty-display">${qty}</div>
          <button class="qty-btn qty-plus" data-id="${productId}" type="button">+</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="cart-control-wrapper">
      <div class="add-btn" data-id="${productId}">Add to Cart</div>
    </div>
  `;
}

export function generateProductHTML(products, useGridLayout = false) {
  return products.map(product => {
    const badgeHTML = product.visualBadge
      ? `<div class="visual-badge">${product.visualBadge}</div>`
      : '';

    return `
      <div class="product-card ${useGridLayout ? 'grid-layout' : ''}">
        <div class="product-image-container">
          ${badgeHTML}
          <img class="product-image" src="${product.image}" alt="${product.title}" />
        </div>
        <div class="product-overlay">
          <div class="product-info">
            <div>
              <div class="product-title">${product.title}</div>
              <div class="product-price">${product.price}</div>
            </div>
            <div class="product-bottom">
              ${renderCartControl(product.id)}
              <div class="like-btn ${state.likedItems.includes(product.id) ? 'liked' : ''}" data-id="${product.id}">
                <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function renderProducts() {
  renderActiveFilters();
  const filteredProducts = getFilteredProducts();
  const sections = document.querySelectorAll('.section-header');
  const scrollSections = document.querySelectorAll('.scroll-section');

  if (isGridMode()) {
    sections.forEach((section, index) => {
      section.style.display = index === 0 ? 'flex' : 'none';
    });

    scrollSections.forEach((section, index) => {
      if (index === 0) {
        section.innerHTML = generateProductHTML(filteredProducts, true);
        section.classList.add('grid-layout');
      } else {
        section.innerHTML = '';
      }
    });

    renderGridHeading();
    return;
  }

  sections.forEach(section => {
    section.style.display = 'flex';
    const seeAllLink = section.querySelector('.section-link');
    if (seeAllLink) {
      seeAllLink.style.display = 'block';
      seeAllLink.textContent = 'See All';
    }
  });

  scrollSections.forEach(section => section.classList.remove('grid-layout'));

  const grouped = splitProductsIntoSections();
  document.getElementById('product-list').innerHTML = generateProductHTML(grouped.trending);
  document.getElementById('product-list-2').innerHTML = generateProductHTML(grouped.happyHour);
  document.getElementById('product-list-3').innerHTML = generateProductHTML(grouped.budgetFriendly);
  document.getElementById('product-list-4').innerHTML = generateProductHTML(grouped.premium);
  document.getElementById('product-list-5').innerHTML = generateProductHTML(grouped.todaysDeal);

  document.querySelector('.section-title').textContent = 'Today\'s Deal';
}

function renderGridHeading() {
  let displayTitle = 'All Products';

  if (state.searchTerm) {
    displayTitle = `Search Results for "${state.searchTerm}"`;
  } else if (state.selectedOfferType) {
    displayTitle = state.selectedOfferType;
  } else if (state.selectedCategory || state.selectedFilterCategory) {
    displayTitle = state.selectedCategory || state.selectedFilterCategory;
  }

  document.querySelector('.section-title').textContent = displayTitle;

  const seeAllLink = document.querySelector('.section-header .section-link');
  if (!seeAllLink) return;

  if (state.searchTerm || state.selectedCategory || state.selectedFilterCategory) {
    seeAllLink.style.display = 'none';
  } else if (state.selectedOfferType) {
    seeAllLink.style.display = 'block';
    seeAllLink.textContent = 'Close';
  }
}

export function resetSeeAllLinks() {
  document.querySelectorAll('.section-link').forEach(link => {
    link.textContent = 'See All';
  });
}

export function renderCartOverlay() {
  const cartContent = document.querySelector('.cart-content');
  const container = cartContent?.querySelector('.cart-items-container');
  const cartFooter = cartContent?.querySelector('.cart-footer');
  if (!container) return;

  container.innerHTML = '';
  const cartIds = Object.keys(state.cart);

  if (cartIds.length === 0) {
    container.innerHTML = '<div style="color: #888; text-align: center; padding: 40px 20px; font-size: 16px;">Your cart is empty.</div>';
    if (cartFooter) cartFooter.style.display = 'none';
    updateCartBadge();
    return;
  }

  if (cartFooter) cartFooter.style.display = 'flex';

  cartIds.forEach(id => {
    const qty = state.cart[id];
    const product = state.allProducts.find(item => item.id === id);
    if (!product) return;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${product.title}</div>
        <div class="cart-item-price">${currency(product.priceValue)} x ${qty}</div>
      </div>
      <div class="qty-selector">
        <button class="qty-btn qty-minus" data-id="${id}" type="button">-</button>
        <div class="qty-display">${qty}</div>
        <button class="qty-btn qty-plus" data-id="${id}" type="button">+</button>
      </div>
    `;
    container.appendChild(itemEl);
  });

  const totals = getCartTotals();
  document.getElementById('cart-subtotal').textContent = currency(totals.subtotal);
  document.getElementById('cart-tax').textContent = currency(totals.tax);
  document.getElementById('cart-total').textContent = currency(totals.total);

  const discountLine = document.querySelector('.discount-line');
  const discountEl = document.getElementById('cart-discount');
  if (totals.discount > 0) {
    if (discountLine) discountLine.style.display = 'flex';
    if (discountEl) discountEl.textContent = `-\u20b9${totals.discount.toFixed(2)}`;
  } else if (discountLine) {
    discountLine.style.display = 'none';
  }

  updateCartBadge();
}

export function renderLikedOverlay() {
  const container = document.querySelector('.liked-items-container');
  if (!container) return;

  const products = state.allProducts.filter(product => state.likedItems.includes(product.id));
  container.innerHTML = products.length === 0
    ? `<div style="grid-column: 1 / -1; color: #888; text-align: center; padding: 40px 20px; font-size: 16px;">You haven't liked any items yet.</div>`
    : generateProductHTML(products, true);

  updateLikedBadge();
}

export function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'block' : 'none';
}

export function updateLikedBadge() {
  const badge = document.getElementById('liked-badge');
  if (!badge) return;

  const count = state.likedItems.length;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'block' : 'none';
}

export function hydratePriceSlider() {
  const slider = document.querySelector('#price-range-input');
  const value = document.querySelector('#price-range-display');

  if (!slider || !value) return;

  slider.value = state.maxPriceFilter;
  value.textContent = `\u20b9${slider.value}`;
  slider.addEventListener('input', () => {
    state.maxPriceFilter = parseInt(slider.value, 10);
    value.textContent = `\u20b9${slider.value}`;
  });
}

export function resetFilterSelections() {
  document.querySelectorAll('.category-option.selected, .offer-option.selected').forEach(option => {
    option.classList.remove('selected');
  });

  const slider = document.querySelector('#price-range-input');
  const value = document.querySelector('#price-range-display');
  if (slider && value) {
    slider.value = DEFAULT_MAX_PRICE;
    value.textContent = `\u20b9${DEFAULT_MAX_PRICE}`;
  }
}

export function renderActiveFilters() {
  const container = document.getElementById('active-filters');
  if (!container) return;
  container.innerHTML = '';

  const createChip = (label, onRemove) => {
    const chip = document.createElement('div');
    chip.className = 'filter-chip';
    chip.innerHTML = `<span>${label}</span><div class="filter-chip-close">X</div>`;
    chip.querySelector('.filter-chip-close').addEventListener('click', () => {
      onRemove();
      renderProducts();
      resetFilterSelections();
    });
    return chip;
  };

  if (state.searchTerm) {
    container.appendChild(createChip(`Search: ${state.searchTerm}`, () => {
      setSearchTerm('');
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';
    }));
  }

  if (state.selectedOfferType) {
    container.appendChild(createChip(`Offer: ${state.selectedOfferType}`, () => {
      state.selectedOfferType = null;
    }));
  }

  if (state.maxPriceFilter !== DEFAULT_MAX_PRICE && state.maxPriceFilter !== null) {
    container.appendChild(createChip(`Max \u20b9${state.maxPriceFilter}`, () => {
      state.maxPriceFilter = DEFAULT_MAX_PRICE;
    }));
  }
}
