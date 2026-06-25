import { addToCart, decrementCartItem, incrementCartItem, toggleLikedItem } from './cart.js';
import { fetchProducts } from './data.js';
import { getUniqueCategories } from './filters.js';
import { closeAllOverlays, hideSuccessModal, showModal, toggleOverlay } from './modal.js';
import {
  generateProductHTML,
  hydratePriceSlider,
  renderCartOverlay,
  renderCategoryOptions,
  renderErrorState,
  renderLikedOverlay,
  renderProducts,
  renderSkeletons,
  renderTags,
  resetFilterSelections,
  resetSeeAllLinks,
  updateCartBadge,
  updateLikedBadge,
  updateTagHighlight
} from './render.js';
import {
  applyFilterSelection,
  clearCheckoutState,
  resetFilters,
  selectCategory,
  selectOfferType,
  setProducts,
  setSearchTerm,
  state
} from './state.js';
import { loadCart, loadLikedItems, saveCart } from './storage.js';

const offerMap = {
  'Trending Now': 'Trending now',
  "Today's Happy Hours": "Today's happy hours",
  'Budget Friendly': 'Budget friendly',
  'Premium Selection': 'Premium selection',
  "Today's Deal": "Today's deal"
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      setTimeout(() => splashScreen.remove(), 1500); // Wait for liquid drop animation
    }, 100);
  }
  state.cart = loadCart();
  state.likedItems = loadLikedItems();

  closeAllOverlays();
  renderSkeletons();
  bindStaticEvents();
  await loadAndRenderProducts();
}

async function loadAndRenderProducts() {
  try {
    renderSkeletons();
    const products = await fetchProducts();
    setProducts(products);
    renderCategoryOptions();
    renderTags(handleTagSelect);
    renderProducts();
    bindSeeAllLinks();
    renderCartOverlay();
    renderLikedOverlay();
    updateCartBadge();
    updateLikedBadge();
  } catch (error) {
    console.error('Data fetch failed:', error);
    renderErrorState(loadAndRenderProducts);
  }
}

function bindStaticEvents() {
  bindSearch();
  bindNavigation();
  bindFilterOverlay();
  bindDelegatedProductActions();
  bindCheckoutControls();
}

function bindSearch() {
  const searchInput = document.querySelector('.top-bar .search-input');
  const searchClear = document.querySelector('.top-bar .search-clear');

  searchInput?.addEventListener('input', event => {
    setSearchTerm(event.target.value);
    if (searchClear) {
      searchClear.style.display = state.searchTerm ? 'block' : 'none';
    }
    renderProducts();
    bindSeeAllLinks();
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    setSearchTerm('');
    searchClear.style.display = 'none';
    renderProducts();
    bindSeeAllLinks();
  });
}

function bindNavigation() {
  const homeTab = document.querySelector('.nav-item:nth-child(1)');
  const categoryTab = document.querySelector('.nav-item:nth-child(2)');
  const likedTab = document.querySelector('.nav-item:nth-child(3)');
  const cartTab = document.querySelector('.nav-item:nth-child(4)');
  const filterButton = document.querySelector('.filter-box');

  homeTab?.addEventListener('click', () => {
    resetFilters();
    updateTagHighlight();
    renderProducts();
    bindSeeAllLinks();
    closeAllOverlays();
  });

  categoryTab?.addEventListener('click', () => toggleOverlay('category'));
  likedTab?.addEventListener('click', () => {
    renderLikedOverlay();
    toggleOverlay('liked');
  });
  cartTab?.addEventListener('click', () => {
    renderCartOverlay();
    toggleOverlay('cart');
  });
  filterButton?.addEventListener('click', () => {
    syncFilterMenuWithState();
    toggleOverlay('filter');
  });

  document.addEventListener('click', event => {
    const overlays = [
      document.getElementById('liked-overlay'),
      document.getElementById('cart-overlay'),
      document.getElementById('category-overlay'),
      document.getElementById('filter-overlay'),
      document.getElementById('success-modal')
    ];
    const triggers = [likedTab, cartTab, categoryTab, filterButton];
    const clickedInsideOverlay = overlays.some(overlay => overlay?.contains(event.target));
    const clickedTrigger = triggers.some(trigger => trigger?.contains(event.target));

    if (!clickedInsideOverlay && !clickedTrigger) {
      closeAllOverlays();
    }
  });

  document.querySelector('.success-close')?.addEventListener('click', hideSuccessModal);
}

function bindFilterOverlay() {
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', () => expandFilterSection(option.dataset.target));
  });

  document.querySelector('.filter-btn.apply')?.addEventListener('click', () => {
    const category = document.querySelector('#drink-type .category-option.selected')?.textContent;
    const offerType = document.querySelector('#offers .offer-option.selected')?.textContent;

    if (!category) {
      showModal('Category Required', 'Please select a Category before applying filters.', true);
      return;
    }

    applyFilterSelection({ category, offerType, maxPrice: state.maxPriceFilter });
    updateTagHighlight();
    renderProducts();
    bindSeeAllLinks();
    closeAllOverlays();
  });

  document.querySelector('.filter-btn.reset')?.addEventListener('click', () => {
    resetFilters();
    resetFilterSelections();
    updateTagHighlight();
    renderProducts();
    bindSeeAllLinks();
    closeAllOverlays();
  });
}

function expandFilterSection(targetId) {
  let anyExpanded = false;

  document.querySelectorAll('.filter-section').forEach(section => {
    if (section.id === targetId) {
      section.classList.add('expanded');
      hydrateFilterSection(section, targetId);
      anyExpanded = true;
    } else {
      section.classList.remove('expanded');
    }
  });

  document.querySelector('.filter-actions')?.classList.toggle('visible', anyExpanded);
}

function hydrateFilterSection(section, targetId) {
  if (targetId === 'drink-type' && section.innerHTML.trim() === '') {
    section.innerHTML = '';

    getUniqueCategories().forEach(category => {
      const option = document.createElement('div');
      option.className = 'category-option';
      option.textContent = category;
      section.appendChild(option);
    });
  }

  if (targetId === 'price-range' && section.innerHTML.trim() === '') {
    const template = document.getElementById('price-range-template');
    section.appendChild(template.content.cloneNode(true));
    hydratePriceSlider();
  }

  if (targetId === 'offers' && section.innerHTML.trim() === '') {
    const template = document.getElementById('offers-template');
    section.appendChild(template.content.cloneNode(true));
  }
}

function bindDelegatedProductActions() {
  document.addEventListener('click', event => {
    const categoryOverlay = document.querySelector('.category-overlay');
    const drinkTypeSection = document.getElementById('drink-type');

    if (event.target.classList.contains('category-option') && categoryOverlay?.contains(event.target)) {
      selectCategory(event.target.textContent);
      updateTagHighlight();
      renderProducts();
      bindSeeAllLinks();
      closeAllOverlays();
      return;
    }

    if (event.target.classList.contains('category-option') && drinkTypeSection?.contains(event.target)) {
      drinkTypeSection.querySelectorAll('.category-option').forEach(option => option.classList.remove('selected'));
      event.target.classList.add('selected');
      return;
    }

    if (event.target.classList.contains('offer-option')) {
      const offersSection = document.getElementById('offers');
      offersSection?.querySelectorAll('.offer-option').forEach(option => option.classList.remove('selected'));
      event.target.classList.add('selected');
      return;
    }

    const likeButton = event.target.closest('.like-btn');
    if (likeButton) {
      toggleLikedItem(likeButton.dataset.id);
      renderLikedOverlay();
      renderProducts();
      bindSeeAllLinks();
      return;
    }

    if (event.target.classList.contains('add-btn')) {
      addToCart(event.target.dataset.id);
      rerenderOrderSurfaces();
    } else if (event.target.classList.contains('qty-plus')) {
      incrementCartItem(event.target.dataset.id);
      rerenderOrderSurfaces();
    } else if (event.target.classList.contains('qty-minus')) {
      decrementCartItem(event.target.dataset.id);
      rerenderOrderSurfaces();
    }
  });
}

function rerenderOrderSurfaces() {
  renderCartOverlay();
  renderLikedOverlay();
  renderProducts();
  bindSeeAllLinks();
}

function bindCheckoutControls() {
  const typeBtns = document.querySelectorAll('.type-btn');
  const tableInputContainer = document.querySelector('.table-input-container');
  const promoInput = document.getElementById('promo-code');

  typeBtns.forEach(btn => {
    btn.addEventListener('click', event => {
      typeBtns.forEach(button => button.classList.remove('active'));
      event.currentTarget.classList.add('active');
      state.isDineIn = event.currentTarget.dataset.type === 'dine-in';
      if (tableInputContainer) {
        tableInputContainer.style.display = state.isDineIn ? 'block' : 'none';
      }
    });
  });

  document.getElementById('apply-promo')?.addEventListener('click', () => {
    const code = promoInput?.value.trim().toUpperCase();
    state.appliedPromoDiscount = code === 'DISCOUNT10' ? 0.10 : 0;
    if (code === 'DISCOUNT10') {
      showModal('Promo Applied!', 'Promo code applied! 10% off.');
    } else {
      showModal('Invalid Code', 'The promo code you entered is invalid.', true);
      if (promoInput) promoInput.value = '';
    }
    renderCartOverlay();
  });

  document.querySelector('.cart-checkout')?.addEventListener('click', () => {
    if (Object.keys(state.cart).length === 0) return;

    if (state.isDineIn) {
      const tableNum = document.getElementById('table-number')?.value.trim();
      if (!tableNum) {
        showModal('Table Number Required', 'Please enter your Table Number for Dine-in.', true);
        return;
      }
    }

    clearCheckoutState();
    saveCart(state.cart);
    if (promoInput) promoInput.value = '';
    const tableNumber = document.getElementById('table-number');
    if (tableNumber) tableNumber.value = '';

    closeAllOverlays();
    renderCartOverlay();
    renderProducts();
    updateCartBadge();
    showModal('Order Placed!', 'Your order has been successfully placed.');
  });
}

function handleTagSelect(category) {
  if (category === 'all') {
    resetFilters();
  } else {
    selectCategory(category);
  }

  syncFilterMenuWithState();
  updateTagHighlight();
  renderProducts();
  bindSeeAllLinks();
  resetSeeAllLinks();
}

function bindSeeAllLinks() {
  document.querySelectorAll('.section-link').forEach(link => {
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);

    newLink.addEventListener('click', event => {
      event.stopPropagation();

      if (newLink.textContent === 'Close') {
        resetFilters();
      } else {
        const title = newLink.parentElement.querySelector('.section-title')?.textContent;
        selectOfferType(offerMap[title]);
      }

      updateTagHighlight();
      renderProducts();
      bindSeeAllLinks();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function syncFilterMenuWithState() {
  const activeCategory = state.selectedCategory || state.selectedFilterCategory;
  
  document.querySelectorAll('#drink-type .category-option').forEach(option => {
    if (option.textContent === activeCategory) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });

  document.querySelectorAll('#offers .offer-option').forEach(option => {
    if (option.textContent === state.selectedOfferType) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });

  const slider = document.querySelector('#price-range-input');
  const value = document.querySelector('#price-range-display');
  if (slider && value) {
    slider.value = state.maxPriceFilter;
    value.textContent = `₹${state.maxPriceFilter}`;
  }
}
