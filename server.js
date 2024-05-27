const express = require("express")
const Cron = require("./modules/Cron")
const logger = require("./utils/logger")

const app = express()
const cron = new Cron()

app.get("/", (req, res) => {
  res.send("Hola")
})

app.listen(2000, async () => {
  logger.info("Server starting...")
  cron.startJob()
})

