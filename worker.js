
const startConsumer = require('./src/services/consumer.service');

startConsumer().catch(err => {
  console.error('Worker failed to start', err);
  process.exit(1);
});
