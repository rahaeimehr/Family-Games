const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const query = `INSERT INTO tblUsers (username, email, phone_number, password_hash, screen_name, security_code) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      userData.username,
      userData.email,
      userData.phone_number,
      userData.password,
      userData.username,
      Math.floor(Math.random() * 1000000)
    ];
    db.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  }
};

module.exports = User;
