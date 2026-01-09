const { prisma } = require('../config/database');

// Smart bill assignment based on occupancy status
const assignBillToUser = async (flatId, billType) => {
  const flat = await prisma.flat.findUnique({
    where: { id: flatId },
    include: {
      owner: true,
      leases: {
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        },
        include: { tenant: true }
      }
    }
  });

  if (!flat) {
    throw new Error('Flat not found');
  }

  // Default to owner
  let assignedUser = flat.owner;

  // If flat is tenant occupied, apply redirection rules
  if (flat.occupancyStatus === 'TENANT_OCCUPIED' && flat.leases.length > 0) {
    const activeLease = flat.leases[0];
    
    switch (billType) {
      case 'RENT':
      case 'ELECTRICITY':
      case 'WATER':
        assignedUser = activeLease.tenant;
        break;
      case 'MAINTENANCE':
      case 'PARKING':
      case 'PENALTY':
        assignedUser = flat.owner;
        break;
      default:
        assignedUser = flat.owner;
    }
  }

  return assignedUser;
};

// Get all bills
const getAllBills = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, billType, flatId, userId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (billType) {
      where.billType = billType;
    }

    if (flatId) {
      where.flatId = flatId;
    }

    if (userId) {
      where.userId = userId;
    }

    // If user is not secretary, only show their bills
    if (req.user.role !== 'SECRETARY') {
      where.userId = req.user.id;
    }

    const [bills, total] = await Promise.all([
      prisma.bill.findMany({
        where,
        include: {
          flat: {
            select: {
              flatNumber: true,
              floor: true
            }
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              role: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.bill.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        bills,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bills'
    });
  }
};

// Get bill by ID
const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const where = { id };
    
    // If user is not secretary, only show their bills
    if (req.user.role !== 'SECRETARY') {
      where.userId = req.user.id;
    }

    const bill = await prisma.bill.findFirst({
      where,
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
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: { bill }
    });
  } catch (error) {
    console.error('Get bill by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill'
    });
  }
};

// Create new bill (Secretary only)
const createBill = async (req, res) => {
  try {
    const { flatId, billType, amount, dueDate, description } = req.body;

    // Get the user to assign the bill to based on occupancy rules
    const assignedUser = await assignBillToUser(flatId, billType);

    const bill = await prisma.bill.create({
      data: {
        flatId,
        userId: assignedUser.id,
        billType,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        description
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: { bill }
    });
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bill'
    });
  }
};

// Update bill (Secretary only)
const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, dueDate, description, status } = req.body;

    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;

    const bill = await prisma.bill.update({
      where: { id },
      data: updateData,
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Bill updated successfully',
      data: { bill }
    });
  } catch (error) {
    console.error('Update bill error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update bill'
    });
  }
};

// Pay bill
const payBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, transactionId } = req.body;

    const where = { id };
    
    // If user is not secretary, only allow paying their own bills
    if (req.user.role !== 'SECRETARY') {
      where.userId = req.user.id;
    }

    const existingBill = await prisma.bill.findFirst({ where });

    if (!existingBill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    if (existingBill.status === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Bill is already paid'
      });
    }

    const bill = await prisma.bill.update({
      where: { id },
      data: {
        status: 'PAID',
        paidDate: new Date()
      },
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Bill paid successfully',
      data: { bill }
    });
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pay bill'
    });
  }
};

// Get overdue bills
const getOverdueBills = async (req, res) => {
  try {
    const where = {
      status: { in: ['DUE', 'OVERDUE'] },
      dueDate: { lt: new Date() }
    };

    // If user is not secretary, only show their bills
    if (req.user.role !== 'SECRETARY') {
      where.userId = req.user.id;
    }

    const overdueBills = await prisma.bill.findMany({
      where,
      include: {
        flat: {
          select: {
            flatNumber: true,
            floor: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json({
      success: true,
      data: { 
        bills: overdueBills,
        count: overdueBills.length
      }
    });
  } catch (error) {
    console.error('Get overdue bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue bills'
    });
  }
};

// Get bill summary for dashboard
const getBillSummary = async (req, res) => {
  try {
    const where = {};
    
    // If user is not secretary, only show their bills
    if (req.user.role !== 'SECRETARY') {
      where.userId = req.user.id;
    }

    const [totalBills, paidBills, dueBills, overdueBills, totalAmount, paidAmount] = await Promise.all([
      prisma.bill.count({ where }),
      prisma.bill.count({ where: { ...where, status: 'PAID' } }),
      prisma.bill.count({ where: { ...where, status: 'DUE' } }),
      prisma.bill.count({ 
        where: { 
          ...where, 
          status: { in: ['DUE', 'OVERDUE'] },
          dueDate: { lt: new Date() }
        } 
      }),
      prisma.bill.aggregate({
        where,
        _sum: { amount: true }
      }),
      prisma.bill.aggregate({
        where: { ...where, status: 'PAID' },
        _sum: { amount: true }
      })
    ]);

    const summary = {
      total: totalBills,
      paid: paidBills,
      due: dueBills,
      overdue: overdueBills,
      totalAmount: totalAmount._sum.amount || 0,
      paidAmount: paidAmount._sum.amount || 0,
      pendingAmount: (totalAmount._sum.amount || 0) - (paidAmount._sum.amount || 0)
    };

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    console.error('Get bill summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bill summary'
    });
  }
};

// Auto-update overdue bills (background job function)
const updateOverdueBills = async () => {
  try {
    const overdueBills = await prisma.bill.updateMany({
      where: {
        status: 'DUE',
        dueDate: { lt: new Date() }
      },
      data: {
        status: 'OVERDUE'
      }
    });

    console.log(`Updated ${overdueBills.count} bills to OVERDUE status`);
    return overdueBills.count;
  } catch (error) {
    console.error('Update overdue bills error:', error);
    throw error;
  }
};

module.exports = {
  getAllBills,
  getBillById,
  createBill,
  updateBill,
  payBill,
  getOverdueBills,
  getBillSummary,
  updateOverdueBills,
  assignBillToUser
};