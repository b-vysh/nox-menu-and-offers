import fs from 'fs';
let content = fs.readFileSync('js/main.js', 'utf8');

const funcs = `
function updateFilterMenuVisibility() {
  const isCategorySelectedInDOM = !!document.querySelector('#drink-type .category-option.selected');
  const priceOption = document.getElementById('filter-option-price');
  const priceSection = document.getElementById('price-range');
  const offersOption = document.getElementById('filter-option-offers');
  const offersSection = document.getElementById('offers');

  if (priceOption) priceOption.style.display = isCategorySelectedInDOM ? 'flex' : 'none';
  if (offersOption) offersOption.style.display = isCategorySelectedInDOM ? 'flex' : 'none';
  
  if (!isCategorySelectedInDOM) {
    if (priceSection) {
      priceSection.style.display = 'none';
      priceSection.classList.remove('expanded');
    }
    if (offersSection) {
      offersSection.style.display = 'none';
      offersSection.classList.remove('expanded');
    }
  }
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
    value.textContent = \`\u20b9\${state.maxPriceFilter}\`;
  }

  updateFilterMenuVisibility();
}
`;

content += funcs;
fs.writeFileSync('js/main.js', content);
