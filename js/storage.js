const CART_KEY = 'madurai-mart-cart';
const LIKED_KEY = 'madurai-mart-liked';

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key} from storage`, error);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Could not write ${key} to storage`, error);
  }
}

export function loadCart() {
  return readJSON(CART_KEY, {});
}

export function saveCart(cart) {
  writeJSON(CART_KEY, cart);
}

export function loadLikedItems() {
  return readJSON(LIKED_KEY, []);
}

export function saveLikedItems(likedItems) {
  writeJSON(LIKED_KEY, likedItems);
}
