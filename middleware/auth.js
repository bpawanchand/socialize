const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../model/User');

module.exports = function(req, res, next) {
  try {
    //    Get the Token
    const token = req.header('x-auth-token');
    //  Throw error for denied aauthorization
    if (!token) throw error;
    //  Verify Token using JWT which accepts token and secret key
    const decoded = jwt.verify(token, config.get('jwtToken'));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      errors: [{ msg: 'Token is not valid or Authorization Denied' }]
    });
  }
};
