const JWT = require('jsonwebtoken');

// Middleware to check for a valid JWT token
const jwtAuth = (req, res, next) => {
  // Check if the token is in the cookies or the Authorization header
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    // Verify the token using the secret key
    const payload = JWT.verify(token, process.env.SECRET);

    // Attach the payload data to the request object (i.e., user data)
    req.user = { id: payload.id, email: payload.email };

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Token verification failed: ' + error.message,
    });
  }
};

module.exports = jwtAuth;
