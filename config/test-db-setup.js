const mongoose = require('mongoose');

// connect to mongo db
const mongoUri = process.env.TEST_DATABASE_URL;
mongoose.connect(mongoUri);

const db = mongoose.connection;

db.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

db.once('open', () => console.log('Connected to database'));

module.exports = mongoose.connection;