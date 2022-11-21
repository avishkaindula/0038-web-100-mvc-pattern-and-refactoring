function addCSRFToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
  // Next will tell to move to the  next middleware after this is executed.
}

module.exports = addCSRFToken;
