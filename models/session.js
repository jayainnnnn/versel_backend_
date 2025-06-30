const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const db = require('./db')
const pgPool = db.pgpool

exports.sessionMiddleware = session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
});