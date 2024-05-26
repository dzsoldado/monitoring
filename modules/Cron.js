
const cron = require('node-cron');
const Monitor = require("./Monitor")


class Cron {
  startJob() {
    const monitor = new Monitor()

    cron.schedule('*/15 * * * * *', async () => {
      console.log('Checking...');
      await monitor.checkStatus()
    });
  }
}


module.exports = Cron