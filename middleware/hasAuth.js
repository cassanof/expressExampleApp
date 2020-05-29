let createError = require('http-errors');

exports.isLoggedIn = function(req, res, next) {
  if (req.user) {
    // console.log(req.user); //for debugging
    next();
  } else {
    next(createError(404, "Page does not exist."));
  }
};