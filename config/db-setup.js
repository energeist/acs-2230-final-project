require('dotenv').config();
const mongoose = require('mongoose');

// connect to mongo db
const mongoUri = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@cat-searcher-cluster1.lzmkow1.mongodb.net/catsearcher`
mongoose.connect(mongoUri);

const db = mongoose.connection;

db.on('error', () => {
  throw new Error(`unable to connect to database`);
});

db.once('open', () => console.log('Connected to database'));

module.exports = mongoose.connection;