const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URI; //connection to atlas

module.exports = db;

