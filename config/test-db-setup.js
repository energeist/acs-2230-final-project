require('dotenv').config();
const mongoose = require('mongoose');

// connect to mongo db
const mongoUri = `mongodb+srv://${process.env.ATLAS_TEST_USER}:${process.env.ATLAS_TEST_PASSWORD}@cat-searcher-test-clust.d3fdsab.mongodb.net/catsearchertest`;
mongoose.connect(mongoUri);

const db = mongoose.connection;

db.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

db.once('open', () => console.log('Connected to database'));

module.exports = mongoose.connection;