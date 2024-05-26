
const Emailer = require("./Emailer")


class Monitor {

  constructor() {
    this.isMainServerDown = false;
    this.isApiClientDown = false;
    this.isApiServerDown = false;
    this.wasMainServerDown = false;
    this.wasApiClientDown = false;
    this.wasApiServerDown = false;

    this.emailer = new Emailer();
  }

  async checkStatus() {
    try {
      this.wasMainServerDown = false;
      this.wasApiClientDown = false;
      this.wasApiServerDown = false;

      const response = await fetch(process.env.HEALTH_ENDPOINT)
      const responseJson = await response.json()

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

      // all servers are up, and at least one of them was down before...
      if (this.areAllServersBackUp) {
        this.emailer.emailAllGood()
        console.log("All are up now")
      }


    } catch (e) {
      // Server is not responding: it's down
      this.mainServerIsDown();
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
    if (!this.wasMainServerDown) {
      console.log("main is down")
      this.emailer.emailMainServerDown()
    }
  }

  apiClientIsDown() {
    this.wasApiClientDown = this.isApiClientDown;
    this.isApiClientDown = true;
    if (!this.wasApiClientDown) {
      this.emailer.emailApiClientDown()
      console.log("api client is down")
    }
  }

  apiServerIsDown() {
    this.wasApiServerDown = this.isApiServerDown;
    this.isApiServerDown = true;
    if (!this.wasApiServerDown) {
      this.emailer.emailApiServerDown()
      console.log("api server is down")
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