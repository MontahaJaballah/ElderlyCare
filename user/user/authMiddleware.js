const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'elderly-care-secret-key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if user is a professional
const isProfessionnel = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.userType !== 'PROFESSIONNEL_SANTE') {
    return res.status(403).json({ error: 'Access denied. Professional role required.' });
  }
  
  next();
};

// Middleware to check if user is an elderly person
const isPersonneAgee = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.userType !== 'PERSONNE_AGEE') {
    return res.status(403).json({ error: 'Access denied. Elderly person role required.' });
  }
  
  next();
};

// Middleware to check if user owns the resource or is an admin
const isResourceOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Check if user ID matches resource ID (from params)
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Access denied. You can only access your own resources.' });
  }
  
  next();
};

module.exports = {
  verifyToken,
  isProfessionnel,
  isPersonneAgee,
  isResourceOwner
};
