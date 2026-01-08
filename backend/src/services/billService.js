const cron = require('node-cron');
const { updateOverdueBills } = require('../controllers/billController');

// Background job to update overdue bills
// Runs every hour to check and update bill statuses
const startBillStatusUpdater = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running overdue bills update job...');
      const updatedCount = await updateOverdueBills();
      console.log(`Overdue bills update completed. Updated ${updatedCount} bills.`);
    } catch (error) {
      console.error('Error in overdue bills update job:', error);
    }
  });

  console.log('Bill status updater background job started (runs every hour)');
};

module.exports = {
  startBillStatusUpdater
};