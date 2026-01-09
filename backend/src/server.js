const app = require('./app');
const { startLeaseExpiryJob } = require('./services/leaseService');
const { startBillStatusUpdater } = require('./services/billService');

const PORT = process.env.PORT || 5001;

// Start the lease expiry background job
let leaseJobId;

const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  
  console.log(`Apartment Management API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start background jobs
  leaseJobId = startLeaseExpiryJob();
  startBillStatusUpdater();
});

