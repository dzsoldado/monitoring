
const nodemailer = require('nodemailer');
const logger = require("../utils/logger")

const FROM_EMAIL = process.env.FROM_EMAIL
const TO_EMAIL = process.env.TO_EMAIL


class Emailer {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    })

  }

  sendEmail(mailOptions) {
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Error occurred: ${error}`);
      } else {
        logger.info(`Email sent: ${info.response}`);
      }
    });
  }

  emailReminder() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "[ISSUE] Some services are still down",
      text: `${new Date().toUTCString()} \nSome services have been down for a while now.`
    };
    this.sendEmail(mailOptions)
  }

  emailMainServerDown() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "[ISSUE] Main server down",
      text: `${new Date().toUTCString()} \nThe main server is down`
    };
    this.sendEmail(mailOptions)
  }

  emailApiClientDown() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "[ISSUE] API client down",
      text: `${new Date().toUTCString()} \nThe API client is down`
    };
    this.sendEmail(mailOptions)
  }

  emailApiServerDown() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "[ISSUE] API server down",
      text: `${new Date().toUTCString()} \nThe API server down is down`
    };
    this.sendEmail(mailOptions)
  }

  emailAllGood() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "[RESOLVED] All servers are up",
      text: `${new Date().toUTCString()} \nAll servers are up`
    };
    this.sendEmail(mailOptions)
  }

}


module.exports = Emailer