// config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'reza',
  password: '8',
  database: 'rahaDB'
});

module.exports = pool;
