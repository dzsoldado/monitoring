
const Emailer = require("./Emailer")
const logger = require("../utils/logger")


const SIX_HOURS_IN_MILLISECONDS = 6 * 60 * 60 * 1000

class Monitor {

  constructor() {
    this.isMainServerDown = false;
    this.isApiClientDown = false;
    this.isApiServerDown = false;
    this.wasMainServerDown = false;
    this.wasApiClientDown = false;
    this.wasApiServerDown = false;
    this.lastTimeNotified = null;

    this.emailer = new Emailer();
  }

  async checkStatus() {
    this.wasMainServerDown = false;
    this.wasApiClientDown = false;
    this.wasApiServerDown = false;

    let response, responseJson
    try {
      response = await fetch(process.env.HEALTH_ENDPOINT)
      responseJson = await response.json()
    } catch (e) {
      // Server is not responding: it's down
      this.mainServerIsDown();
    }

    if (response && responseJson) {
      // Server is responding: it's up
      this.mainServerIsUp()

      // Check the status of the other services
      const apiClientStatus = responseJson.dependencies.find((dependency) => dependency.name === "api_client")
      const apiServerStatus = responseJson.dependencies.find((dependency) => dependency.name === "api_server")

      if (!apiClientStatus.is_active) {
        this.apiClientIsDown()
      } else {
        this.apiClientIsUp()
      }

      if (!apiServerStatus.is_active) {
        this.apiServerIsDown()
      } else {
        this.apiServerIsUp()
      }
    }

    // all servers are up, and at least one of them was down before
    if (this.areAllServersBackUp) {
      this.emailer.emailAllGood()
      this.lastTimeNotified = null;
      logger.info("All services are up now")
    } else {
      // If the server hasn't been up for x amount of time already
      if (this.lastTimeNotified &&
        new Date().getTime() > (this.lastTimeNotified.getTime() + SIX_HOURS_IN_MILLISECONDS)) {
        this.lastTimeNotified = new Date();
        logger.info("The servers haven't been restored for a while");
        this.emailer.emailReminder()
      }
    }

  }

  mainServerIsUp() {
    this.wasApiServerDown = this.isMainServerDown;
    this.isMainServerDown = false;
  }

  apiClientIsUp() {
    this.wasApiClientDown = this.isApiClientDown;
    this.isApiClientDown = false;
  }

  apiServerIsUp() {
    this.wasApiServerDown = this.isApiServerDown;
    this.isApiServerDown = false;
  }

  mainServerIsDown() {
    this.wasMainServerDown = this.isMainServerDown;
    this.isMainServerDown = true;
    logger.warn("Main server is down")
    if (!this.wasMainServerDown) {
      this.emailer.emailMainServerDown()
      this.lastTimeNotified = new Date()
    }
  }

  apiClientIsDown() {
    this.wasApiClientDown = this.isApiClientDown;
    this.isApiClientDown = true;
    logger.warn("Api client is down")
    if (!this.wasApiClientDown) {
      this.emailer.emailApiClientDown()
      this.lastTimeNotified = new Date()
    }
  }

  apiServerIsDown() {
    this.wasApiServerDown = this.isApiServerDown;
    this.isApiServerDown = true;
    logger.warn("Api server is down")
    if (!this.wasApiServerDown) {
      this.emailer.emailApiServerDown()
      this.lastTimeNotified = new Date()
    }
  }

  get areAllServersBackUp() {
    return (
      !this.isApiClientDown
      & !this.isApiServerDown
      & !this.isMainServerDown)
      & (
        this.wasMainServerDown
        | this.wasApiClientDown
        | this.wasApiServerDown
      )
  }
}


module.exports = Monitor