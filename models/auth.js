function requireLogin(req, res, next) {
  if (req.session && req.session.isLoggedin && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}
module.exports = { requireLogin };