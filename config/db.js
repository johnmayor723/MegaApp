// db/createMongoConnection.js
const mongoose = require('mongoose');

module.exports = async function createMongoConnection(uri) {
  const conn = mongoose.createConnection(uri, {
    maxPoolSize: 10,
  });

  conn.on('connected', () => {
    console.log(`✅ Mongo connected: ${uri}`);
  });

  conn.on('error', (err) => {
    console.error(`❌ Mongo error (${uri}):`, err);
  });

  return conn;
};
