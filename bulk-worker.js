const startBulkWorker = require('./src/services/bulk-worker.service');

startBulkWorker().catch(err => {
  console.error('Bulk worker failed', err);
  process.exit(1);
});
