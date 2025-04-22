const jwt = require('jsonwebtoken');
const axios = require('axios');

// Keycloak configuration matching Spring Boot settings
const keycloakConfig = {
  realm: 'ElderlyCareKeycloak',
  issuerUri: 'http://localhost:8080/realms/ElderlyCareKeycloak',
  jwksUri: 'http://localhost:8080/realms/ElderlyCareKeycloak/protocol/openid-connect/certs',
  resourceId: 'medical',
  principalAttribute: 'preferred_username'
};

// Cache for the public keys
let publicKeys = null;
let lastFetchTime = 0;

/**
 * Fetch public keys from Keycloak
 * @returns {Promise<Object>} - Public keys
 */
async function fetchPublicKeys() {
  // Only fetch keys if we don't have them or they're older than 1 hour
  const now = Date.now();
  if (publicKeys && now - lastFetchTime < 3600000) {
    return publicKeys;
  }

  try {
    const response = await axios.get(keycloakConfig.jwksUri);
    publicKeys = response.data;
    lastFetchTime = now;
    return publicKeys;
  } catch (error) {
    console.error('Failed to fetch public keys from Keycloak:', error);
    throw error;
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Decoded token
 */
async function verifyToken(token) {
  try {
    const keys = await fetchPublicKeys();
    const kid = jwt.decode(token, { complete: true })?.header?.kid;
    
    if (!kid) {
      throw new Error('Invalid token format');
    }
    
    const key = keys.keys.find(k => k.kid === kid);
    if (!key) {
      throw new Error('Key not found');
    }
    
    // Convert JWK to PEM format
    const jwkToPem = require('jwk-to-pem');
    const pem = jwkToPem(key);
    
    // Verify token
    const decoded = jwt.verify(token, pem, {
      issuer: keycloakConfig.issuerUri,
      algorithms: ['RS256']
    });
    
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error;
  }
}

/**
 * Create JWT authentication middleware
 * @returns {Function} - Express middleware
 */
function createJwtMiddleware() {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = await verifyToken(token);
      
      // Add user info to request
      req.user = {
        id: decoded.sub,
        username: decoded[keycloakConfig.principalAttribute] || decoded.preferred_username,
        roles: decoded.realm_access?.roles || [],
        email: decoded.email,
        token: decoded
      };
      
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

/**
 * Create role-based authorization middleware
 * @param {string|string[]} roles - Required roles
 * @returns {Function} - Express middleware
 */
function createRoleMiddleware(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userRoles = req.user.roles || [];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (requiredRoles.some(role => userRoles.includes(role))) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}

module.exports = {
  // Middleware for JWT authentication
  jwtAuth: createJwtMiddleware(),
  
  // Middleware for role-based authorization
  requireRole: (role) => createRoleMiddleware(role),
  
  // Middleware for admin authorization
  requireAdmin: createRoleMiddleware('equip_admin'),
  
  // Config for reference
  keycloakConfig
};
