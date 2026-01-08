// Role-based access control middleware

// Define role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
  GUARD: 1,
  STAFF: 2,
  TENANT: 3,
  OWNER: 4,
  SECRETARY: 5
};

// Define permissions for each role
const ROLE_PERMISSIONS = {
  SECRETARY: [
    'users:create', 'users:read', 'users:update', 'users:delete',
    'flats:create', 'flats:read', 'flats:update', 'flats:delete',
    'leases:create', 'leases:read', 'leases:update', 'leases:delete',
    'bills:create', 'bills:read', 'bills:update', 'bills:delete',
    'notices:create', 'notices:read', 'notices:update', 'notices:delete',
    'issues:read', 'issues:update',
    'visitors:read',
    'analytics:read'
  ],
  OWNER: [
    'flats:read:own',
    'leases:read:own',
    'bills:read:own', 'bills:pay:own',
    'notices:read',
    'issues:create', 'issues:read:own',
    'visitors:read:own', 'visitors:approve:own'
  ],
  TENANT: [
    'bills:read:own', 'bills:pay:own',
    'notices:read',
    'issues:create', 'issues:read:own',
    'visitors:approve:own'
  ],
  STAFF: [
    'issues:read', 'issues:update',
    'notices:read'
  ],
  GUARD: [
    'visitors:create', 'visitors:read', 'visitors:update',
    'notices:read'
  ]
};

// Check if user has required role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user has minimum role level
const requireMinRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const minRoleLevel = ROLE_HIERARCHY[minRole] || 0;

    if (userRoleLevel < minRoleLevel) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if user has specific permission
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: 'Permission denied'
      });
    }

    next();
  };
};

// Check if user can access own resources
const requireOwnership = (resourceField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Secretary can access all resources
    if (req.user.role === 'SECRETARY') {
      return next();
    }

    // Check if user is accessing their own resource
    const resourceUserId = req.params[resourceField] || req.body[resourceField];
    
    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - can only access own resources'
      });
    }

    next();
  };
};

// Secretary only access
const secretaryOnly = requireRole('SECRETARY');

// Owner or Secretary access
const ownerOrSecretary = requireRole('OWNER', 'SECRETARY');

// Resident access (Owner or Tenant)
const residentOnly = requireRole('OWNER', 'TENANT');

// Staff or Secretary access
const staffOrSecretary = requireRole('STAFF', 'SECRETARY');

// Guard access
const guardOnly = requireRole('GUARD');

module.exports = {
  requireRole,
  requireMinRole,
  requirePermission,
  requireOwnership,
  secretaryOnly,
  ownerOrSecretary,
  residentOnly,
  staffOrSecretary,
  guardOnly,
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS
};