import fs from 'fs';

// 1. Read index.html
let html = fs.readFileSync('index.html', 'utf8');

// The new desired order of blocks:
// 1. Today's Deal (product-list-5)
// 2. Trending Now (product-list)
// 3. Today's Happy Hours (product-list-2)
// 4. Premium Selection (product-list-4)
// 5. Budget Friendly (product-list-3)

const replacement = `  <!-- Product Sections -->
  <div class="section-header"><div class="section-title">Today's Deal</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list-5"></div>

  <div class="section-header"><div class="section-title">Trending Now</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list"></div>

  <div class="section-header"><div class="section-title">Today's Happy Hours</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list-2"></div>

  <div class="section-header"><div class="section-title">Premium Selection</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list-4"></div>

  <div class="section-header"><div class="section-title">Budget Friendly</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list-3"></div>

  <!-- Bottom Navigation -->`;

html = html.replace(/  <!-- Product Sections -->[\s\S]*?<!-- Bottom Navigation -->/, replacement);
fs.writeFileSync('index.html', html);

// 2. Update render.js to restore the correct first-section title
let renderJs = fs.readFileSync('js/render.js', 'utf8');
renderJs = renderJs.replace(
  /document\.querySelector\('\.section-title'\)\.textContent = 'Trending Now';/,
  "document.querySelector('.section-title').textContent = 'Today\\'s Deal';"
);
fs.writeFileSync('js/render.js', renderJs);
