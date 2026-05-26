const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./router/authRoutes'));
app.use('/api/stores',     require('./router/storeRoutes'));
app.use('/api/products',   require('./router/productRoutes'));
app.use('/api/orders',     require('./router/orderRoutes'));
app.use('/api/merchants',  require('./router/merchantRoutes'));
app.use('/api/users',      require('./router/userRoutes'));

// Updated routes
app.use('/api/genres',     require('./router/genreRoutes'));
app.use('/api/book-types', require('./router/bookTypeRoutes'));

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
);

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports = app;