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
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',    
    maxAge: 60 * 60 * 60 * 1000
  }
});