const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  create: async (userData) => {
    const query = `INSERT INTO tblUsers (username, screen_name, email, phone_number, password_hash, security_code) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [
      userData.username,
      userData.screen_name,
      userData.email,
      userData.phone_number,
      userData.password, // Ensure password is already hashed before this point
      Math.floor(Math.random() * 1000000)
    ];

    try {
      const [result] = await db.query(query, values);
      return result;
    } catch (err) {
      throw err;
    }
  },

  login: async (username, password) => {
    const query = `SELECT * FROM tblUsers WHERE username = ?`;

    try {
      const [results] = await db.query(query, [username]);

      if (results.length === 0) {
        return false; // User not found
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (isMatch) {
        return user; // Passwords match, login successful
      } else {
        return false; // Passwords do not match
      }
    } catch (err) {
      throw err;
    }
  }
};

module.exports = User;
