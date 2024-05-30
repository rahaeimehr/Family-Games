const expressSession = require('express-session');

const sessionMiddleware = expressSession({
  secret: process.env.SESSION_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
});

module.exports = sessionMiddleware;
