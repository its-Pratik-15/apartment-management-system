const { prisma } = require('../config/database');

// Get all issues
const getAllIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, category, reporterId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (category) {
      where.category = category;
    }

    if (reporterId) {
      where.reporterId = reporterId;
    }

    // Role-based filtering
    if (req.user.role === 'OWNER' || req.user.role === 'TENANT') {
      // Owners and tenants can only see their own issues
      where.reporterId = req.user.id;
    }

    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        include: {
          reporter: {
            select: {
              firstName: true,
              lastName: true,
              role: true
            }
          }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.issue.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        issues,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get issues error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues'
    });
  }
};

// Get issue by ID
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        reporter: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            email: true
          }
        }
      }
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check access permissions
    if ((req.user.role === 'OWNER' || req.user.role === 'TENANT') && 
        issue.reporterId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { issue }
    });
  } catch (error) {
    console.error('Get issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issue'
    });
  }
};

// Create issue (Owner/Tenant)
const createIssue = async (req, res) => {
  try {
    const { title, description, category, priority = 'MEDIUM' } = req.body;

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        category,
        priority,
        status: 'OPEN',
        reporterId: req.user.id
      },
      include: {
        reporter: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: { issue }
    });
  } catch (error) {
    console.error('Create issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create issue'
    });
  }
};

// Update issue (Secretary/Staff can update all, Owner/Tenant can update their own)
const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, status, resolution } = req.body;

    const existingIssue = await prisma.issue.findUnique({
      where: { id }
    });

    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check permissions
    const canUpdate = req.user.role === 'SECRETARY' || 
                     req.user.role === 'STAFF' || 
                     existingIssue.reporterId === req.user.id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this issue'
      });
    }

    const updateData = {};
    
    // Owners/Tenants can only update basic fields
    if (req.user.role === 'OWNER' || req.user.role === 'TENANT') {
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (priority !== undefined) updateData.priority = priority;
    } else {
      // Secretary/Staff can update all fields
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (priority !== undefined) updateData.priority = priority;
      if (status !== undefined) updateData.status = status;
      if (resolution !== undefined) updateData.resolution = resolution;
      
      // Set resolved date if status is being set to RESOLVED
      if (status === 'RESOLVED') {
        updateData.resolvedAt = new Date();
      }
    }

    const issue = await prisma.issue.update({
      where: { id },
      data: updateData,
      include: {
        reporter: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Issue updated successfully',
      data: { issue }
    });
  } catch (error) {
    console.error('Update issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issue'
    });
  }
};

// Delete issue (Secretary only or issue reporter)
const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const existingIssue = await prisma.issue.findUnique({
      where: { id }
    });

    if (!existingIssue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check permissions
    const canDelete = req.user.role === 'SECRETARY' || 
                     existingIssue.reporterId === req.user.id;

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this issue'
      });
    }

    await prisma.issue.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });
  } catch (error) {
    console.error('Delete issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete issue'
    });
  }
};

// Assign issue to staff (Secretary only) - DISABLED: assignedTo field not in schema
const assignIssue = async (req, res) => {
  try {
    return res.status(400).json({
      success: false,
      message: 'Issue assignment feature not available - assignedTo field not implemented in schema'
    });
  } catch (error) {
    console.error('Assign issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign issue'
    });
  }
};

// Get issue statistics
const getIssueStats = async (req, res) => {
  try {
    const where = {};
    
    // Role-based filtering
    if (req.user.role === 'OWNER' || req.user.role === 'TENANT') {
      where.reporterId = req.user.id;
    }

    const [totalIssues, openIssues, inProgressIssues, resolvedIssues, highPriorityIssues] = await Promise.all([
      prisma.issue.count({ where }),
      prisma.issue.count({ where: { ...where, status: 'OPEN' } }),
      prisma.issue.count({ where: { ...where, status: 'IN_PROGRESS' } }),
      prisma.issue.count({ where: { ...where, status: 'RESOLVED' } }),
      prisma.issue.count({ where: { ...where, priority: 'HIGH' } })
    ]);

    const stats = {
      total: totalIssues,
      open: openIssues,
      inProgress: inProgressIssues,
      resolved: resolvedIssues,
      highPriority: highPriorityIssues
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get issue stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issue statistics'
    });
  }
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  assignIssue,
  getIssueStats
};