# NOX - Restobar Menu & Offers

![NOX Banner](./images/Frame%209.png) <!-- Update banner path if you have a primary logo -->

NOX is a fully responsive, mobile-first web application designed to serve as a digital menu and interactive offers catalog for a modern restobar. The application provides a seamless browsing experience with dynamic category filtering, a local shopping cart, and a "Liked Items" system. 

Built entirely as a static frontend application, NOX delivers high performance and instant interactions without the need for a backend server.

---

## 🚀 Features

- **Interactive Digital Menu:** Browse through various drink and food categories.
- **Smart Cascading Filters:** Narrow down products by specific price ranges (e.g., Under ₹500) and curated offer types (e.g., Happy Hours, Budget Friendly).
- **Cart & Order Management:** Add items to a shopping cart, adjust quantities, apply promo codes, and specify order preferences (Dine-in vs. Pickup).
- **Favorites System:** Users can "Like" their favorite items for quick access later in the session.
- **Modern UI/UX:** Features a sleek dark-mode aesthetic with custom scrollbars, micro-animations, horizontal scroll-snapping, and glassmorphism design elements.
- **State Persistence:** Filter states and user selections persist seamlessly while navigating between different views.

---

## 🛠️ Tech Stack

This project is built using core web technologies, ensuring a lightweight footprint and maximum browser compatibility:

- **HTML5:** Semantic structure and layout.
- **CSS3:** Custom styling, CSS Grid/Flexbox layouts, and CSS animations (no external utility frameworks).
- **JavaScript (ES6+):** Modular, vanilla JavaScript handling state management, DOM manipulation, and event delegation.

---

## 📂 Project Structure

```text
├── images/             # Static image assets and SVG icons
├── js/                 # Modular JavaScript files
│   ├── data.js         # Mock product database and inventory
│   ├── filters.js      # Logic for categorizing and filtering products
│   ├── main.js         # Entry point and global event listeners
│   ├── modal.js        # Logic for opening/closing UI overlays
│   ├── render.js       # DOM generation and HTML rendering functions
│   └── state.js        # Centralized application state manager
├── index.html          # Main HTML document
└── styles.css          # Global stylesheet
```

---

## 💻 Getting Started

Because NOX is a fully static application, getting it running locally is incredibly straightforward.

### Prerequisites
You only need a modern web browser and a local HTTP server to avoid CORS issues when loading modular JavaScript.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nox-menu-and-offers.git
   cd nox-menu-and-offers
   ```

2. **Serve the application:**
   You can use any local web server. If you have Node.js installed, you can run:
   ```bash
   npx http-server . -p 8080 -s
   ```
   *Alternatively, if you use VS Code, you can install the "Live Server" extension and click "Go Live".*

3. **View the app:**
   Open your browser and navigate to `http://localhost:8080`.

---

## 🌐 Architecture Note

This project is entirely static. All product data is mocked directly via `js/data.js`, and user sessions (like the cart and liked items) are managed entirely client-side. It can be easily deployed to any static hosting service with zero configuration.

---

*Designed and developed for a premium restobar experience.*
