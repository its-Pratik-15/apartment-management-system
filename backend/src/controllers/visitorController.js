const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all visitor logs
const getAllVisitorLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, isApproved, flatId, date, search } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (isApproved !== undefined) {
      if (isApproved === 'true') {
        where.isApproved = true;
      } else if (isApproved === 'false') {
        where.isApproved = false;
      } else if (isApproved === 'null' || isApproved === 'pending') {
        where.isApproved = null;
      }
    }

    if (flatId) {
      where.flatId = flatId;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.inTime = {
        gte: startDate,
        lt: endDate
      };
    }

    // Search functionality
    if (search) {
      where.OR = [
        { visitorName: { contains: search, mode: 'insensitive' } },
        { visitorPhone: { contains: search } },
        { purpose: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Role-based filtering
    if (req.user.role === 'OWNER') {
      // Owners can only see visitors to their flats
      const userFlats = await prisma.flat.findMany({
        where: { ownerId: req.user.id },
        select: { id: true }
      });
      where.flatId = { in: userFlats.map(f => f.id) };
    } else if (req.user.role === 'TENANT') {
      // Tenants can only see visitors to flats they lease
      const userLeases = await prisma.lease.findMany({
        where: { 
          tenantId: req.user.id,
          isActive: true 
        },
        select: { flatId: true }
      });
      where.flatId = { in: userLeases.map(l => l.flatId) };
    } else if (req.user.role === 'GUARD') {
      // Guards can see all visitors, but can filter for pending resident requests
      if (req.query.pendingResidentRequests === 'true') {
        where.hostId = { not: null };
        where.guardId = null;
        where.isApproved = null;
      }
    }

    const [visitorLogs, total] = await Promise.all([
      prisma.visitorLog.findMany({
        where,
        include: {
          flat: {
            select: {
              flatNumber: true,
              floor: true,
              owner: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          guard: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          host: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.visitorLog.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        visitors: visitorLogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get visitor logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor logs'
    });
  }
};

// Get visitor log by ID
const getVisitorLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const visitorLog = await prisma.visitorLog.findUnique({
      where: { id },
      include: {
        flat: {
          include: {
            owner: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        guard: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    if (!visitorLog) {
      return res.status(404).json({
        success: false,
        message: 'Visitor log not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'OWNER') {
      if (visitorLog.flat.ownerId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (req.user.role === 'TENANT') {
      const userLease = await prisma.lease.findFirst({
        where: {
          tenantId: req.user.id,
          flatId: visitorLog.flatId,
          isActive: true
        }
      });
      
      if (!userLease) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: { visitor: visitorLog }
    });
  } catch (error) {
    console.error('Get visitor log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor log'
    });
  }
};

// Create visitor entry (Guard only) or visitor request (Owner/Tenant/Secretary)
const createVisitorEntry = async (req, res) => {
  try {
    const { 
      visitorName, 
      visitorPhone, 
      flatId, 
      purpose, 
      vehicleNumber,
      idProofType,
      idProofNumber 
    } = req.body;

    let visitorData = {
      visitorName,
      visitorPhone,
      flatId,
      purpose
    };

    // Different workflow based on user role
    if (req.user.role === 'GUARD') {
      // Guard-initiated: Guard creates entry, needs host approval
      visitorData.guardId = req.user.id;
      visitorData.isApproved = null; // Pending approval from host
    } else if (['OWNER', 'TENANT', 'SECRETARY'].includes(req.user.role)) {
      // Resident-initiated: Resident requests visitor, needs guard approval
      visitorData.hostId = req.user.id;
      visitorData.isApproved = null; // Pending approval from guard
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to create visitor entries'
      });
    }

    const visitorLog = await prisma.visitorLog.create({
      data: visitorData,
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true,
            owner: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        guard: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        host: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    const message = req.user.role === 'GUARD' 
      ? 'Visitor entry created successfully'
      : 'Visitor request submitted successfully';

    res.status(201).json({
      success: true,
      message,
      data: { visitor: visitorLog }
    });
  } catch (error) {
    console.error('Create visitor entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create visitor entry'
    });
  }
};

// Approve/Reject visitor (Owner/Tenant for guard-initiated, Guard for resident-initiated)
const updateVisitorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, rejectionReason } = req.body;

    // Validate isApproved
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isApproved must be true or false'
      });
    }

    const existingLog = await prisma.visitorLog.findUnique({
      where: { id },
      include: { 
        flat: true,
        guard: true,
        host: true
      }
    });

    if (!existingLog) {
      return res.status(404).json({
        success: false,
        message: 'Visitor log not found'
      });
    }

    if (existingLog.isApproved !== null) {
      return res.status(400).json({
        success: false,
        message: 'Visitor request has already been processed'
      });
    }

    // Check permissions based on workflow type
    let canApprove = false;
    
    if (existingLog.guardId && !existingLog.hostId) {
      // Guard-initiated visitor: Owner/Tenant can approve
      if (req.user.role === 'OWNER' && existingLog.flat.ownerId === req.user.id) {
        canApprove = true;
      } else if (req.user.role === 'TENANT') {
        const userLease = await prisma.lease.findFirst({
          where: {
            tenantId: req.user.id,
            flatId: existingLog.flatId,
            isActive: true
          }
        });
        canApprove = !!userLease;
      }
    } else if (existingLog.hostId && !existingLog.guardId) {
      // Resident-initiated visitor: Guard can approve
      canApprove = req.user.role === 'GUARD';
    }

    if (!canApprove) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to approve this visitor request'
      });
    }

    const visitorLog = await prisma.visitorLog.update({
      where: { id },
      data: {
        isApproved,
        rejectionReason: !isApproved ? rejectionReason : null,
        updatedAt: new Date()
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        },
        guard: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        host: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: `Visitor ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: { visitor: visitorLog }
    });
  } catch (error) {
    console.error('Update visitor status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update visitor status'
    });
  }
};

// Record visitor check-in (Guard only)
const recordVisitorCheckIn = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLog = await prisma.visitorLog.findUnique({
      where: { id }
    });

    if (!existingLog) {
      return res.status(404).json({
        success: false,
        message: 'Visitor log not found'
      });
    }

    if (existingLog.isApproved !== true) {
      return res.status(400).json({
        success: false,
        message: 'Can only check in approved visitors'
      });
    }

    if (existingLog.inTime) {
      return res.status(400).json({
        success: false,
        message: 'Visitor already checked in'
      });
    }

    const visitorLog = await prisma.visitorLog.update({
      where: { id },
      data: {
        inTime: new Date()
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Visitor checked in successfully',
      data: { visitor: visitorLog }
    });
  } catch (error) {
    console.error('Record visitor check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record visitor check-in'
    });
  }
};

// Record visitor exit (Guard only)
const recordVisitorExit = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLog = await prisma.visitorLog.findUnique({
      where: { id }
    });

    if (!existingLog) {
      return res.status(404).json({
        success: false,
        message: 'Visitor log not found'
      });
    }

    if (existingLog.isApproved !== true) {
      return res.status(400).json({
        success: false,
        message: 'Can only record exit for approved visitors'
      });
    }

    if (existingLog.outTime) {
      return res.status(400).json({
        success: false,
        message: 'Exit already recorded for this visitor'
      });
    }

    const visitorLog = await prisma.visitorLog.update({
      where: { id },
      data: {
        outTime: new Date()
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Visitor exit recorded successfully',
      data: { visitor: visitorLog }
    });
  } catch (error) {
    console.error('Record visitor exit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record visitor exit'
    });
  }
};

// Get pending approvals for user
const getPendingApprovals = async (req, res) => {
  try {
    let where = { isApproved: null };

    // Filter based on user role
    if (req.user.role === 'OWNER') {
      const userFlats = await prisma.flat.findMany({
        where: { ownerId: req.user.id },
        select: { id: true }
      });
      where.flatId = { in: userFlats.map(f => f.id) };
    } else if (req.user.role === 'TENANT') {
      const userLeases = await prisma.lease.findMany({
        where: { 
          tenantId: req.user.id,
          isActive: true 
        },
        select: { flatId: true }
      });
      where.flatId = { in: userLeases.map(l => l.flatId) };
    } else {
      // Guards and others can see all pending
    }

    const pendingVisitors = await prisma.visitorLog.findMany({
      where,
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        }
      },
      orderBy: { inTime: 'desc' }
    });

    res.json({
      success: true,
      data: { 
        pendingVisitors,
        count: pendingVisitors.length
      }
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals'
    });
  }
};

module.exports = {
  getAllVisitorLogs,
  getVisitorLogById,
  createVisitorEntry,
  updateVisitorStatus,
  recordVisitorCheckIn,
  recordVisitorExit,
  getPendingApprovals
};