const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all flats
const getAllFlats = async (req, res) => {
  try {
    const { page = 1, limit = 10, floor, occupancyStatus, search, ownerId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (floor) {
      where.floor = parseInt(floor);
    }

    if (occupancyStatus) {
      where.occupancyStatus = occupancyStatus;
    }

    if (search) {
      where.flatNumber = { contains: search };
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    const [flats, total] = await Promise.all([
      prisma.flat.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          leases: {
            where: { isActive: true },
            include: {
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
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { flatNumber: 'asc' }
      }),
      prisma.flat.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        flats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all flats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flats'
    });
  }
};

// Get flat by ID
const getFlatById = async (req, res) => {
  try {
    const { id } = req.params;

    const flat = await prisma.flat.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        leases: {
          include: {
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
          orderBy: { createdAt: 'desc' }
        },
        bills: {
          select: {
            id: true,
            billType: true,
            amount: true,
            status: true,
            dueDate: true,
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!flat) {
      return res.status(404).json({
        success: false,
        message: 'Flat not found'
      });
    }

    res.json({
      success: true,
      data: { flat }
    });
  } catch (error) {
    console.error('Get flat by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flat'
    });
  }
};

// Create new flat (Secretary only)
const createFlat = async (req, res) => {
  try {
    const { flatNumber, floor, bedrooms, bathrooms, area, ownerId } = req.body;

    // Check if flat number already exists
    const existingFlat = await prisma.flat.findUnique({
      where: { flatNumber }
    });

    if (existingFlat) {
      return res.status(409).json({
        success: false,
        message: 'Flat number already exists'
      });
    }

    // Verify owner exists and has OWNER role
    const owner = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    if (owner.role !== 'OWNER') {
      return res.status(400).json({
        success: false,
        message: 'User must have OWNER role to own a flat'
      });
    }

    const flat = await prisma.flat.create({
      data: {
        flatNumber,
        floor: parseInt(floor),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        area: parseFloat(area),
        ownerId
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Flat created successfully',
      data: { flat }
    });
  } catch (error) {
    console.error('Create flat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create flat'
    });
  }
};

// Update flat (Secretary only)
const updateFlat = async (req, res) => {
  try {
    const { id } = req.params;
    const { flatNumber, floor, bedrooms, bathrooms, area, ownerId } = req.body;

    // Check if new flat number conflicts with existing (if changed)
    if (flatNumber) {
      const existingFlat = await prisma.flat.findFirst({
        where: {
          flatNumber,
          NOT: { id }
        }
      });

      if (existingFlat) {
        return res.status(409).json({
          success: false,
          message: 'Flat number already exists'
        });
      }
    }

    // Verify new owner if provided
    if (ownerId) {
      const owner = await prisma.user.findUnique({
        where: { id: ownerId }
      });

      if (!owner || owner.role !== 'OWNER') {
        return res.status(400).json({
          success: false,
          message: 'Invalid owner specified'
        });
      }
    }

    const flat = await prisma.flat.update({
      where: { id },
      data: {
        ...(flatNumber && { flatNumber }),
        ...(floor && { floor: parseInt(floor) }),
        ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
        ...(bathrooms && { bathrooms: parseInt(bathrooms) }),
        ...(area && { area: parseFloat(area) }),
        ...(ownerId && { ownerId })
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Flat updated successfully',
      data: { flat }
    });
  } catch (error) {
    console.error('Update flat error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Flat not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update flat'
    });
  }
};

// Delete flat (Secretary only)
const deleteFlat = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for dependencies
    const flatWithDependencies = await prisma.flat.findUnique({
      where: { id },
      include: {
        leases: { where: { isActive: true } },
        bills: { where: { status: { not: 'PAID' } } },
        visitorLogs: true
      }
    });

    if (!flatWithDependencies) {
      return res.status(404).json({
        success: false,
        message: 'Flat not found'
      });
    }

    const dependencies = [];
    if (flatWithDependencies.leases.length > 0) {
      dependencies.push('active leases');
    }
    if (flatWithDependencies.bills.length > 0) {
      dependencies.push('unpaid bills');
    }
    if (flatWithDependencies.visitorLogs.length > 0) {
      dependencies.push('visitor logs');
    }

    if (dependencies.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete flat with ${dependencies.join(', ')}. Please resolve these first.`
      });
    }

    await prisma.flat.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Flat deleted successfully'
    });
  } catch (error) {
    console.error('Delete flat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete flat'
    });
  }
};

// Update occupancy status (automatic based on lease)
const updateOccupancyStatus = async (flatId) => {
  try {
    const activeLeases = await prisma.lease.findMany({
      where: {
        flatId,
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() }
      }
    });

    const occupancyStatus = activeLeases.length > 0 ? 'TENANT_OCCUPIED' : 'OWNER_OCCUPIED';

    await prisma.flat.update({
      where: { id: flatId },
      data: { occupancyStatus }
    });

    return occupancyStatus;
  } catch (error) {
    console.error('Update occupancy status error:', error);
    throw error;
  }
};

// Get flats by owner (Owner can see their own flats)
const getFlatsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.role === 'SECRETARY' ? req.params.ownerId : req.user.id;

    const flats = await prisma.flat.findMany({
      where: { ownerId },
      include: {
        leases: {
          where: { isActive: true },
          include: {
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
        }
      },
      orderBy: { flatNumber: 'asc' }
    });

    res.json({
      success: true,
      data: { flats }
    });
  } catch (error) {
    console.error('Get flats by owner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch owner flats'
    });
  }
};

module.exports = {
  getAllFlats,
  getFlatById,
  createFlat,
  updateFlat,
  deleteFlat,
  updateOccupancyStatus,
  getFlatsByOwner
};