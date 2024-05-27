const expressSession = require('express-session');

const sessionMiddleware = expressSession({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true
});

module.exports = sessionMiddleware;
