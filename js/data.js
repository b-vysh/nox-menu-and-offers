import { mockItems, mockOffers, itemSpecificImages } from './mockData.js';

const categoryImages = {
  Beer: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=300&q=80',
  Wine: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=300&q=80',
  Whiskey: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=300&q=80',
  Rum: 'https://images.unsplash.com/photo-1615887023516-9b5a8e0f63b4?auto=format&fit=crop&w=300&q=80',
  Vodka: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=300&q=80',
  Tequila: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=300&q=80',
  Brandy: 'https://unsplash.com/photos/E3Gt-g4q4F4/download?w=300',
  'Energy Drinks': 'https://unsplash.com/photos/1aiTO5KNxv0/download?w=300',
  Water: 'https://unsplash.com/photos/uY4ZZZQ7uGE/download?w=300',
  Soda: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80',
  Snacks: 'https://unsplash.com/photos/wC_2vv5TAZI/download?w=300',
  'Fruit juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=300&q=80',
  Accessories: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=300&q=80',
  'Main course': 'https://images.unsplash.com/photo-1544025162-811114215649?auto=format&fit=crop&w=300&q=80',
  Sides: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
  Entrees: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=300&q=80',
  Desserts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=300&q=80',
  Gin: 'https://images.unsplash.com/photo-1563514766624-b153572cdce5?auto=format&fit=crop&w=300&q=80'
};

const removedItems = ['MAT-44', 'MAT-45', 'MAT-47', 'MAT-60'];
const excludedCategories = ['Accessories', 'Water', 'Soda', 'Energy Drinks'];
const alcCategories = ['Beer', 'Wine', 'Whiskey', 'Rum', 'Vodka', 'Tequila', 'Brandy', 'Gin'];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getOfferTypeForProduct(index, category, name) {
  const excludedFromTodaysDeal = ['Desserts', 'Snacks', 'Fruit juice', 'Sides'];
  const excludedNames = ['CHICKEN 65', 'PANEER TIKKA'];
  const types = [];

  if (!excludedFromTodaysDeal.includes(category) && !excludedNames.includes(name)) {
    types.push("Today's deal");
  }

  if (alcCategories.includes(category)) {
    types.push("Today's happy hours");
  }

  if (types.length === 0) return null;
  return types[index % types.length];
}

function getBudgetFriendlyIds(validItems) {
  const excludedBudgetCategories = ['Water', 'Accessories', 'Entrees', 'Sides', 'Snacks', 'Fruit juice'];
  const grouped = {};

  validItems
    .filter(item => !excludedBudgetCategories.includes(item.category))
    .forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

  return Object.values(grouped)
    .flatMap(items => items.sort((a, b) => a.mrp - b.mrp).slice(0, 2))
    .map(item => item.id);
}

function getVisualBadge(item, types, chefPickCounts) {
  const charCodeSum = item.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);

  if (chefPickCounts[item.category] > 0) {
    chefPickCounts[item.category] -= 1;
    return 'Chef Pick';
  }

  if (types.includes("Today's deal")) {
    const visualBadges = ['2+1', 'BOGO', 'till 8 PM', '10% off', '20% off'];
    return visualBadges[charCodeSum % visualBadges.length];
  }

  if (types.includes("Today's happy hours")) {
    const visualBadges = ['10% off', '20% off', '50% off'];
    return visualBadges[charCodeSum % visualBadges.length];
  }

  return null;
}

function buildProducts() {
  if (!mockItems) {
    throw new Error('Mock catalog not available');
  }

  const validItems = mockItems.filter(item => (
    !excludedCategories.includes(item.category) && !removedItems.includes(item.id)
  ));
  const validPremiumItems = validItems.filter(item => alcCategories.includes(item.category));
  const top10PremiumIds = [...validPremiumItems]
    .sort((a, b) => b.mrp - a.mrp)
    .slice(0, 10)
    .map(item => item.id);
  const budgetFriendlyIds = getBudgetFriendlyIds(validItems);
  const chefPickCounts = {
    'Main course': 2,
    Entrees: 2,
    Sides: 1,
    Desserts: 1
  };

  return validItems.map((item, index) => {
    const image = itemSpecificImages[item.id]
      || categoryImages[item.category]
      || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=300&q=80';
    const offerTypes = [];

    if (mockOffers['Trending now']?.includes(item.id)) {
      offerTypes.push('Trending now');
    }

    if (budgetFriendlyIds.includes(item.id)) {
      offerTypes.push('Budget friendly');
    }

    if (top10PremiumIds.includes(item.id)) {
      offerTypes.push('Premium selection');
    }

    if (offerTypes.length === 0) {
      const offer = getOfferTypeForProduct(index, item.category, item.name);
      if (offer) offerTypes.push(offer);
    }

    return {
      id: item.id,
      title: item.name,
      subtitle: item.subcategory,
      price: `\u20b9${item.mrp}`,
      priceValue: item.mrp,
      rating: 4 + Math.random() * 0.9,
      image,
      scateg: item.category,
      offerTypes,
      visualBadge: getVisualBadge(item, offerTypes, chefPickCounts)
    };
  });
}

export async function fetchProducts() {
  await delay(600);
  return buildProducts();
}
