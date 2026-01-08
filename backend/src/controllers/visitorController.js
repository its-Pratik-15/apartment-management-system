const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all visitor logs
const getAllVisitorLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, flatId, date } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (flatId) {
      where.flatId = flatId;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      where.entryTime = {
        gte: startDate,
        lt: endDate
      };
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
          approvedBy: {
            select: {
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { entryTime: 'desc' }
      }),
      prisma.visitorLog.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        visitorLogs,
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
        approvedBy: {
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
      data: { visitorLog }
    });
  } catch (error) {
    console.error('Get visitor log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor log'
    });
  }
};

// Create visitor entry (Guard only)
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

    const visitorLog = await prisma.visitorLog.create({
      data: {
        visitorName,
        visitorPhone,
        flatId,
        purpose,
        vehicleNumber,
        idProofType,
        idProofNumber,
        entryTime: new Date(),
        status: 'PENDING'
      },
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
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Visitor entry created successfully',
      data: { visitorLog }
    });
  } catch (error) {
    console.error('Create visitor entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create visitor entry'
    });
  }
};

// Approve/Reject visitor (Owner/Tenant)
const updateVisitorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be APPROVED or REJECTED'
      });
    }

    const existingLog = await prisma.visitorLog.findUnique({
      where: { id },
      include: { flat: true }
    });

    if (!existingLog) {
      return res.status(404).json({
        success: false,
        message: 'Visitor log not found'
      });
    }

    if (existingLog.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Visitor request has already been processed'
      });
    }

    // Check permissions
    let canApprove = false;
    
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

    if (!canApprove) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to approve visitors for this flat'
      });
    }

    const visitorLog = await prisma.visitorLog.update({
      where: { id },
      data: {
        status,
        remarks,
        approvedById: req.user.id,
        approvedAt: new Date()
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        },
        approvedBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: `Visitor ${status.toLowerCase()} successfully`,
      data: { visitorLog }
    });
  } catch (error) {
    console.error('Update visitor status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update visitor status'
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

    if (existingLog.status !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Can only record exit for approved visitors'
      });
    }

    if (existingLog.exitTime) {
      return res.status(400).json({
        success: false,
        message: 'Exit already recorded for this visitor'
      });
    }

    const visitorLog = await prisma.visitorLog.update({
      where: { id },
      data: {
        exitTime: new Date(),
        status: 'COMPLETED'
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
      data: { visitorLog }
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
    let where = { status: 'PENDING' };

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
      orderBy: { entryTime: 'desc' }
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
  recordVisitorExit,
  getPendingApprovals
};