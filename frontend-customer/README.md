# Bazaar — Consumer Web

Vite + React e-commerce storefront, connects to the Express backend on port 5000.

## Setup
```bash
cd consumer-web
npm install
npm run dev        # → http://localhost:3001
```

## Pages
- `/`              Home: hero, category pills, 10 latest products + Load More
- `/product/:id`   Product detail: image, info, add to cart, link to store
- `/store/:id`     Store page: all products, filter by sort/category/brand
- `/search?q=`     Search results: matching products (10 at a time) + matching stores
- `/auth`          Login / Register
- `/cart`          Cart with qty controls + checkout (fires POST /orders per item)
- `/orders`        Order history with 3-step delivery tracker

## Directory
```
consumer-web/
├── index.html
├── vite.config.js        # proxy /api and /uploads → localhost:5000
├── package.json
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── lib/api.js            # axios + auth interceptor
    ├── store/
    │   ├── authStore.js      # zustand persisted user auth
    │   └── cartStore.js      # zustand persisted cart
    ├── pages/
    │   ├── Home.jsx / .css
    │   ├── AuthPage.jsx / .css
    │   ├── ProductDetail.jsx / .css
    │   ├── StorePage.jsx / .css
    │   ├── SearchResults.jsx / .css
    │   ├── Cart.jsx / .css
    │   └── Orders.jsx / .css
    └── components/
        ├── layout/
        │   ├── Navbar.jsx / .css
        │   └── Footer.jsx / .css
        └── ui/
            ├── ProductCard.jsx / .css
            └── Spinner.jsx / .css
```
