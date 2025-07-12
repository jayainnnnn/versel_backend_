function requireLogin(req, res, next) {
  if (req.session && req.session.isLoggedin && req.session.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
}

function requireAdmin(req,res,next){
  if(req.session && req.session.isLoggedin && req.session.user && req.session.user.role==="admin"){
    next();
  }
  else{
    res.status(404).json({message: 'Unauthorized Admin'})
  }
}
module.exports = { requireLogin,requireAdmin };