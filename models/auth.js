function requireLogin(req, res, next) {
  if (req.session && req.session.isLoggedin && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
}
module.exports = { requireLogin };