require('dotenv').config();
const app  = require('./src/app');
const db   = require('./src/config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.getConnection();
    console.log('✅ MySQL connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
})();
