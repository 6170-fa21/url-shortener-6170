const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.url = 'mongodb://localhost:27017/test';

module.exports = db;

