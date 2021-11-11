const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGODB_URI;

module.exports = db;

