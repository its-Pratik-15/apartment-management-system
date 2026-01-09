const { prisma } = require('../config/database');
const { updateOccupancyStatus } = require('./flatController');

// Helper function to get tenant's current flat
const getTenantCurrentFlat = async (tenantId) => {
  try {
    const activeLease = await prisma.lease.findFirst({
      where: {
        tenantId,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      },
      include: {
        flat: true
      }
    });
    
    return activeLease ? activeLease.flat : null;
  } catch (error) {
    console.error('Error getting tenant current flat:', error);
    return null;
  }
};

// Get all leases
const getAllLeases = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, flatId, tenantId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    // Role-based access control
    if (req.user.role === 'OWNER') {
      // Owners can only see leases for their flats
      const userFlats = await prisma.flat.findMany({
        where: { ownerId: req.user.id },
        select: { id: true }
      });
      where.flatId = { in: userFlats.map(f => f.id) };
    } else if (req.user.role === 'TENANT') {
      // Tenants can only see their own leases
      where.tenantId = req.user.id;
    } else if (req.user.role === 'SECRETARY') {
      // Secretary can see all leases, apply filters if provided
      if (flatId) {
        where.flatId = flatId;
      }
      if (tenantId) {
        where.tenantId = tenantId;
      }
    } else {
      // Other roles have no access to leases
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to view leases'
      });
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const [leases, total] = await Promise.all([
      prisma.lease.findMany({
        where,
        include: {
          flat: {
            select: {
              id: true,
              flatNumber: true,
              floor: true,
              owner: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          tenant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lease.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        leases,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all leases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leases'
    });
  }
};

// Get lease by ID
const getLeaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const lease = await prisma.lease.findUnique({
      where: { id },
      include: {
        flat: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    res.json({
      success: true,
      data: { lease }
    });
  } catch (error) {
    console.error('Get lease by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lease'
    });
  }
};

// Create new lease (Secretary only)
const createLease = async (req, res) => {
  try {
    const { flatId, tenantId, startDate, endDate, monthlyRent, securityDeposit } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check if flat exists and get owner info
    const flat = await prisma.flat.findUnique({
      where: { id: flatId },
      include: { owner: true }
    });

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: 'Flat not found'
      });
    }

    // Check if tenant exists and has TENANT role
    const tenant = await prisma.user.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    if (tenant.role !== 'TENANT') {
      return res.status(400).json({
        success: false,
        message: 'User must have TENANT role'
      });
    }

    // Check for overlapping active leases
    const overlappingLease = await prisma.lease.findFirst({
      where: {
        flatId,
        isActive: true,
        OR: [
          {
            AND: [
              { startDate: { lte: start } },
              { endDate: { gte: start } }
            ]
          },
          {
            AND: [
              { startDate: { lte: end } },
              { endDate: { gte: end } }
            ]
          },
          {
            AND: [
              { startDate: { gte: start } },
              { endDate: { lte: end } }
            ]
          }
        ]
      }
    });

    if (overlappingLease) {
      return res.status(409).json({
        success: false,
        message: 'Lease period overlaps with existing active lease'
      });
    }

    // Create lease
    const lease = await prisma.lease.create({
      data: {
        flatId,
        tenantId,
        startDate: start,
        endDate: end,
        monthlyRent: parseFloat(monthlyRent),
        securityDeposit: securityDeposit ? parseFloat(securityDeposit) : null
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        },
        tenant: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Update flat occupancy status if lease is currently active
    if (start <= new Date() && end >= new Date()) {
      await updateOccupancyStatus(flatId);
    }

    res.status(201).json({
      success: true,
      message: 'Lease created successfully',
      data: { lease }
    });
  } catch (error) {
    console.error('Create lease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lease'
    });
  }
};

// Update lease (Secretary only)
const updateLease = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, monthlyRent, securityDeposit, isActive } = req.body;

    const existingLease = await prisma.lease.findUnique({
      where: { id }
    });

    if (!existingLease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    const updateData = {};
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate) updateData.endDate = new Date(endDate);
    if (monthlyRent) updateData.monthlyRent = parseFloat(monthlyRent);
    if (securityDeposit !== undefined) updateData.securityDeposit = securityDeposit ? parseFloat(securityDeposit) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const lease = await prisma.lease.update({
      where: { id },
      data: updateData,
      include: {
        flat: {
          select: {
            id: true,
            flatNumber: true,
            floor: true
          }
        },
        tenant: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Update flat occupancy status
    await updateOccupancyStatus(lease.flatId);

    res.json({
      success: true,
      message: 'Lease updated successfully',
      data: { lease }
    });
  } catch (error) {
    console.error('Update lease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lease'
    });
  }
};

// Terminate lease (Secretary only)
const terminateLease = async (req, res) => {
  try {
    const { id } = req.params;
    const { terminationDate, reason } = req.body;

    const lease = await prisma.lease.findUnique({
      where: { id }
    });

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    if (!lease.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Lease is already terminated'
      });
    }

    const termDate = terminationDate ? new Date(terminationDate) : new Date();

    const updatedLease = await prisma.lease.update({
      where: { id },
      data: {
        isActive: false,
        endDate: termDate
      },
      include: {
        flat: {
          select: {
            flatNumber: true
          }
        },
        tenant: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Update flat occupancy status
    await updateOccupancyStatus(lease.flatId);

    res.json({
      success: true,
      message: 'Lease terminated successfully',
      data: { lease: updatedLease }
    });
  } catch (error) {
    console.error('Terminate lease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to terminate lease'
    });
  }
};

// Get expiring leases (Secretary only)
const getExpiringLeases = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const expiringLeases = await prisma.lease.findMany({
      where: {
        isActive: true,
        endDate: {
          gte: new Date(),
          lte: futureDate
        }
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true,
            owner: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        tenant: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { endDate: 'asc' }
    });

    res.json({
      success: true,
      data: { 
        leases: expiringLeases,
        count: expiringLeases.length
      }
    });
  } catch (error) {
    console.error('Get expiring leases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expiring leases'
    });
  }
};

// Auto-expire leases (background job function)
const autoExpireLeases = async () => {
  try {
    const expiredLeases = await prisma.lease.findMany({
      where: {
        isActive: true,
        endDate: { lt: new Date() }
      }
    });

    for (const lease of expiredLeases) {
      await prisma.lease.update({
        where: { id: lease.id },
        data: { isActive: false }
      });

      // Update flat occupancy status
      await updateOccupancyStatus(lease.flatId);
    }

    console.log(`Auto-expired ${expiredLeases.length} leases`);
    return expiredLeases.length;
  } catch (error) {
    console.error('Auto-expire leases error:', error);
    throw error;
  }
};

module.exports = {
  getAllLeases,
  getLeaseById,
  createLease,
  updateLease,
  terminateLease,
  getExpiringLeases,
  autoExpireLeases,
  getTenantCurrentFlat
};