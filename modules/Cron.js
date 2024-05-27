
const cron = require('node-cron');
const Monitor = require("./Monitor")
const logger = require("../utils/logger")


class Cron {
  startJob() {
    const monitor = new Monitor()

    cron.schedule('*/5 * * * *', async () => {
      logger.info('Checking status');
      await monitor.checkStatus()
    });
  }
}


module.exports = Cron