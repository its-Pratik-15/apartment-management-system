const { prisma } = require('../config/database');
const { autoExpireLeases } = require('../controllers/leaseController');

// Background job to check and expire leases
const runLeaseExpiryJob = async () => {
  try {
    console.log('Running lease expiry job...');
    
    // Auto-expire leases that have passed their end date
    const expiredCount = await autoExpireLeases();
    
    if (expiredCount > 0) {
      console.log(`Expired ${expiredCount} leases`);
    }
    
    // Get leases expiring in the next 30 days for alerts
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    
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
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    if (expiringLeases.length > 0) {
      console.log(`${expiringLeases.length} leases expiring in the next 30 days`);
      
      // Here you could add email notifications, push notifications, etc.
      // For now, we'll just log the alerts
      expiringLeases.forEach(lease => {
        const daysUntilExpiry = Math.ceil((lease.endDate - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`Lease for ${lease.flat.flatNumber} expires in ${daysUntilExpiry} days`);
      });
    }
    
    return {
      expiredCount,
      expiringCount: expiringLeases.length,
      expiringLeases
    };
  } catch (error) {
    console.error('Lease expiry job error:', error);
    throw error;
  }
};

// Get lease alerts for dashboard
const getLeaseAlerts = async () => {
  try {
    const now = new Date();
    
    // Leases expiring in 7 days
    const urgentDate = new Date();
    urgentDate.setDate(urgentDate.getDate() + 7);
    
    // Leases expiring in 30 days
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 30);
    
    const [urgentLeases, warningLeases, expiredLeases] = await Promise.all([
      // Urgent (7 days)
      prisma.lease.findMany({
        where: {
          isActive: true,
          endDate: {
            gte: now,
            lte: urgentDate
          }
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
        },
        orderBy: { endDate: 'asc' }
      }),
      
      // Warning (30 days)
      prisma.lease.findMany({
        where: {
          isActive: true,
          endDate: {
            gt: urgentDate,
            lte: warningDate
          }
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
        },
        orderBy: { endDate: 'asc' }
      }),
      
      // Already expired but still active (needs manual intervention)
      prisma.lease.findMany({
        where: {
          isActive: true,
          endDate: { lt: now }
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
        },
        orderBy: { endDate: 'asc' }
      })
    ]);
    
    return {
      urgent: urgentLeases.map(lease => ({
        ...lease,
        daysUntilExpiry: Math.ceil((lease.endDate - now) / (1000 * 60 * 60 * 24)),
        alertType: 'urgent'
      })),
      warning: warningLeases.map(lease => ({
        ...lease,
        daysUntilExpiry: Math.ceil((lease.endDate - now) / (1000 * 60 * 60 * 24)),
        alertType: 'warning'
      })),
      expired: expiredLeases.map(lease => ({
        ...lease,
        daysOverdue: Math.ceil((now - lease.endDate) / (1000 * 60 * 60 * 24)),
        alertType: 'expired'
      }))
    };
  } catch (error) {
    console.error('Get lease alerts error:', error);
    throw error;
  }
};

// Start the lease expiry job (runs every hour)
const startLeaseExpiryJob = () => {
  console.log('Starting lease expiry background job...');
  
  // Run immediately
  runLeaseExpiryJob().catch(console.error);
  
  // Then run every hour (3600000 ms)
  const intervalId = setInterval(() => {
    runLeaseExpiryJob().catch(console.error);
  }, 3600000);
  
  return intervalId;
};

// Stop the lease expiry job
const stopLeaseExpiryJob = (intervalId) => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('Stopped lease expiry background job');
  }
};

module.exports = {
  runLeaseExpiryJob,
  getLeaseAlerts,
  startLeaseExpiryJob,
  stopLeaseExpiryJob
};