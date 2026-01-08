const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all notices
const getAllNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10, isPinned } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    
    if (isPinned !== undefined) {
      where.isPinned = isPinned === 'true';
    }

    // Filter notices based on user role
    const userRole = req.user.role;
    where.OR = [
      { targetRoles: { contains: userRole } },
      { targetRoles: { contains: 'ALL' } },
      { targetRoles: null }
    ];

    const [notices, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        include: {
          author: {
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
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ]
      }),
      prisma.notice.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        notices,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notices'
    });
  }
};

// Get notice by ID
const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await prisma.notice.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Check if user can view this notice
    const userRole = req.user.role;
    const canView = !notice.targetRoles || 
                   notice.targetRoles.includes('ALL') || 
                   notice.targetRoles.includes(userRole);

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this notice'
      });
    }

    res.json({
      success: true,
      data: { notice }
    });
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice'
    });
  }
};

// Create notice (Secretary only)
const createNotice = async (req, res) => {
  try {
    const { title, content, targetRoles, isPinned = false, expiryDate } = req.body;

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        targetRoles: targetRoles ? targetRoles.join(',') : null,
        isPinned,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        authorId: req.user.id
      },
      include: {
        author: {
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
      message: 'Notice created successfully',
      data: { notice }
    });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notice'
    });
  }
};

// Update notice (Secretary only)
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, targetRoles, isPinned, expiryDate } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (targetRoles !== undefined) updateData.targetRoles = targetRoles ? targetRoles.join(',') : null;
    if (isPinned !== undefined) updateData.isPinned = isPinned;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;

    const notice = await prisma.notice.update({
      where: { id },
      data: updateData,
      include: {
        author: {
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
      message: 'Notice updated successfully',
      data: { notice }
    });
  } catch (error) {
    console.error('Update notice error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update notice'
    });
  }
};

// Delete notice (Secretary only)
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.notice.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Notice deleted successfully'
    });
  } catch (error) {
    console.error('Delete notice error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to delete notice'
    });
  }
};

// Toggle pin status (Secretary only)
const togglePinStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existingNotice = await prisma.notice.findUnique({
      where: { id }
    });

    if (!existingNotice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    const notice = await prisma.notice.update({
      where: { id },
      data: {
        isPinned: !existingNotice.isPinned
      },
      include: {
        author: {
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
      message: `Notice ${notice.isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: { notice }
    });
  } catch (error) {
    console.error('Toggle pin status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle pin status'
    });
  }
};

// Get pinned notices
const getPinnedNotices = async (req, res) => {
  try {
    const userRole = req.user.role;
    
    const pinnedNotices = await prisma.notice.findMany({
      where: {
        isPinned: true,
        OR: [
          { targetRoles: { contains: userRole } },
          { targetRoles: { contains: 'ALL' } },
          { targetRoles: null }
        ]
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { 
        notices: pinnedNotices,
        count: pinnedNotices.length
      }
    });
  } catch (error) {
    console.error('Get pinned notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pinned notices'
    });
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  togglePinStatus,
  getPinnedNotices
};