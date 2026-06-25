import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');

const replacement = `  <!-- Tags -->
  <div class="tag-container" id="tag-container"></div>
  <div class="active-filters-container" id="active-filters"></div>

  <!-- Product Sections -->
  <div class="section-header"><div class="section-title">Trending Now</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list"></div>

  <div class="section-header"><div class="section-title">Today's Happy Hours</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list-2"></div>

  <div class="section-header"><div class="section-title">Budget Friendly</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list-3"></div>

  <div class="section-header"><div class="section-title">Premium Selection</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list-4"></div>

  <div class="section-header"><div class="section-title">Today's Deal</div><div class="section-link">See All</div></div>
  <div class="scroll-section" id="product-list-5"></div>

  <!-- Bottom Navigation -->`;

content = content.replace(/  <!-- Tags -->[\s\S]*?<!-- Bottom Navigation -->/, replacement);

fs.writeFileSync('index.html', content);
