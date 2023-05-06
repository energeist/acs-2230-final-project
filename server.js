require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// Set App Variable
const app = express();

// Use Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Database Setup
require('./config/db-setup.js')

app.use(express.json());

// Controllers
const catsRouter = require('./controllers/cats');
app.use('/cats', catsRouter);

// Start Server
app.listen(3000, () => console.log('PetSearcher listening on port 3000...'));