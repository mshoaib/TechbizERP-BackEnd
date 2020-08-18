const db = require('../config/db.js');

const coaMiddleware = (req, res, next) => {
  const body = req.body;

  next(req.body);
};

module.exports = {
  coaMiddleware
};
