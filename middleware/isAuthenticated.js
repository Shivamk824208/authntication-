 const jwt = require('jsonwebtoken');
 const User = require('../models/usermodel.js');


const isAuthenticated = async (req, res, next) => {
    try{
          const authHeader = req.headers.authorization;
          if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({ message : 'authorization token missing'});
          }
          const token = authHeader.split(' ')[1];

         const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    req.user = user; // best practice
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'token expired, please login again' });
    }

    return res.status(401).json({ message: 'invalid token' });
  }
};

module.exports = isAuthenticated;