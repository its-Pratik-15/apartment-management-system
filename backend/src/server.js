const app = require('./app');
const { startLeaseExpiryJob } = require('./services/leaseService');
const { startBillStatusUpdater } = require('./services/billService');

const PORT = process.env.PORT || 5000;

// Start the lease expiry background job
let leaseJobId;

const server = app.listen(PORT, () => {
  console.log(`🚀 Apartment Management API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start background jobs
  leaseJobId = startLeaseExpiryJob();
  startBillStatusUpdater();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  if (leaseJobId) {
    const { stopLeaseExpiryJob } = require('./services/leaseService');
    stopLeaseExpiryJob(leaseJobId);
  }
  
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  
  if (leaseJobId) {
    const { stopLeaseExpiryJob } = require('./services/leaseService');
    stopLeaseExpiryJob(leaseJobId);
  }
  
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});