const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'LegalIndia Infrastructure Layer',
    services: {
      frontend: 'Vercel',
      backend: 'Railway',
      database: 'Railway'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`🚀 LegalIndia Infra running on port ${PORT}`);
});

