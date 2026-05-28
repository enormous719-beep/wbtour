const express = require('express');
const app = express();
const port = 5000;

// Middleware untuk mengizinkan frontend di port lain mengakses API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Biarkan akses dari frontend
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Endpoint API sederhana
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Express API!' });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Backend berjalan di http://localhost:${port}`);
});
