import { state } from './state.js';
import { saveCart, saveLikedItems } from './storage.js';

export function addToCart(productId) {
  state.cart[productId] = 1;
  saveCart(state.cart);
}

export function incrementCartItem(productId) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  saveCart(state.cart);
}

export function decrementCartItem(productId) {
  if (state.cart[productId] > 1) {
    state.cart[productId] -= 1;
  } else {
    delete state.cart[productId];
  }

  saveCart(state.cart);
}

export function toggleLikedItem(productId) {
  if (state.likedItems.includes(productId)) {
    state.likedItems = state.likedItems.filter(id => id !== productId);
  } else {
    state.likedItems.push(productId);
  }

  saveLikedItems(state.likedItems);
}

export function getCartCount() {
  return Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
}

export function getCartTotals() {
  const subtotal = Object.entries(state.cart).reduce((sum, [id, qty]) => {
    const product = state.allProducts.find(item => item.id === id);
    return product ? sum + product.priceValue * qty : sum;
  }, 0);
  const tax = subtotal * 0.05;
  const discount = subtotal * state.appliedPromoDiscount;

  return {
    subtotal,
    tax,
    discount,
    total: subtotal + tax - discount
  };
}
