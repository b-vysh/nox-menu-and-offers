import { DEFAULT_MAX_PRICE, state } from './state.js';

export function getUniqueCategories() {
  return [...new Set(state.allProducts.map(product => product.scateg))];
}

export function getFilteredProducts() {
  let products = state.allProducts;

  if (state.selectedOfferType) {
    products = products.filter(product => product.offerTypes?.includes(state.selectedOfferType));
  }

  const activeCategory = state.selectedFilterCategory || state.selectedCategory;
  if (activeCategory) {
    products = products.filter(product => product.scateg === activeCategory);
  }

  if (state.maxPriceFilter !== null && state.maxPriceFilter !== DEFAULT_MAX_PRICE) {
    products = products.filter(product => product.priceValue <= state.maxPriceFilter);
  }

  if (state.searchTerm) {
    products = products.filter(product => (
      product.title.toLowerCase().includes(state.searchTerm)
      || product.subtitle.toLowerCase().includes(state.searchTerm)
      || product.scateg?.toLowerCase().includes(state.searchTerm)
    ));
  }

  return products;
}

export function splitProductsIntoSections(products = state.allProducts) {
  return {
    trending: products.filter(product => product.offerTypes?.includes('Trending now')),
    happyHour: products.filter(product => product.offerTypes?.includes("Today's happy hours")),
    budgetFriendly: products.filter(product => product.offerTypes?.includes('Budget friendly')),
    premium: products.filter(product => product.offerTypes?.includes('Premium selection')),
    todaysDeal: products.filter(product => product.offerTypes?.includes("Today's deal"))
  };
}

export function isGridMode() {
  return Boolean(
    state.selectedCategory
    || state.selectedFilterCategory
    || state.selectedOfferType
    || state.searchTerm
  );
}
