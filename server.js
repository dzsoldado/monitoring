const express = require("express")
const Cron = require("./modules/Cron")

const app = express()

const cron = new Cron()

app.get("/", (req, res) => {
  res.send("Hola")
})



app.listen(2000, async () => {
  console.log("We're up")
  cron.startJob()
})

