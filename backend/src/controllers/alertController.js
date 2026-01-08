const { getLeaseAlerts } = require('../services/leaseService');

// Get all alerts for secretary dashboard
const getAlerts = async (req, res) => {
  try {
    const leaseAlerts = await getLeaseAlerts();
    
    const alerts = {
      leases: leaseAlerts,
      summary: {
        urgent: leaseAlerts.urgent.length,
        warning: leaseAlerts.warning.length,
        expired: leaseAlerts.expired.length,
        total: leaseAlerts.urgent.length + leaseAlerts.warning.length + leaseAlerts.expired.length
      }
    };
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts'
    });
  }
};

module.exports = {
  getAlerts
};