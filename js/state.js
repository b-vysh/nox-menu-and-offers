export const DEFAULT_MAX_PRICE = 10000;

export const state = {
  selectedCategory: null,
  selectedFilterCategory: null,
  selectedOfferType: null,
  allProducts: [],
  searchTerm: '',
  cart: {},
  likedItems: [],
  maxPriceFilter: DEFAULT_MAX_PRICE,
  appliedPromoDiscount: 0,
  isDineIn: false
};

export function setProducts(products) {
  state.allProducts = products;
}

export function setSearchTerm(term) {
  state.searchTerm = term.trim().toLowerCase();
}

export function selectCategory(category) {
  state.selectedCategory = category;
  state.selectedFilterCategory = null;
}

export function selectOfferType(offerType) {
  state.selectedOfferType = offerType;
  state.selectedCategory = null;
  state.selectedFilterCategory = null;
}

export function applyFilterSelection({ category, offerType, maxPrice }) {
  if (category) {
    state.selectedFilterCategory = category;
    state.selectedCategory = null;
  }
  if (offerType) {
    state.selectedOfferType = offerType;
  }
  if (typeof maxPrice === 'number') state.maxPriceFilter = maxPrice;
}

export function resetFilters() {
  state.selectedCategory = null;
  state.selectedFilterCategory = null;
  state.selectedOfferType = null;
  state.maxPriceFilter = DEFAULT_MAX_PRICE;
}

export function clearCheckoutState() {
  state.cart = {};
  state.appliedPromoDiscount = 0;
}
