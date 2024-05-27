const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'reza',
  password: '8',
  database: 'rahaDB'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
});

module.exports = db;
