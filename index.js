const express = require('express');


const appA = require('./Bolbuk/index');
const appB = require('./Multitenant-app/index');
const appC = require('./Adbeconhope1/index');

const server = express();
const PORT = process.env.PORT || 3060;

server.set('trust proxy', true);

// ============================
// 🌍 Domain → App mapping
// ============================
const domainMap = {
  // 🔹 Production domains
  'www.bolbuk.com': appA,
  'bolbuk.com': appA,

  'www.easyhostnet.com': appB,
  'easyhostnet.com': appB,

  'www.adedoyinbeaconofhopefoundation.com.ng': appC,
  'adedoyinbeaconofhopefoundation.com.ng': appC,

  // 🔹 Localhost aliases
  'bolbuk.localhost': appA,
  'easyhostnet.localhost': appB,
  'adedoyin.localhost': appC,

  // 🔹 Default localhost fallback
  'localhost': appA,
  '127.0.0.1': appA,
};

// ============================
// 🧭 Domain Router
// ============================
server.use((req, res, next) => {
  const host = req.hostname.toLowerCase();
  const targetApp = domainMap[host];

  console.log('🌐 Incoming host:', host);

  if (!targetApp) {
    return res
      .status(404)
      .send(`Domain "${host}" not configured`);
  }

  return targetApp(req, res, next);
});

// ============================
// 🚀 Start server
// ============================
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});