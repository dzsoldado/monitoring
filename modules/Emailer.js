
const nodemailer = require('nodemailer');

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

  emailMainServerDown() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: '[ISSUE] Main server down',
      text: 'The main server is down'
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

  emailApiClientDown() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: '[ISSUE] API client down',
      text: 'The API client down is down'
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

  emailApiServerDown() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: '[ISSUE] API server down',
      text: 'The API server down is down'
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }


  emailAllGood() {
    const mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: '[RESOLVED] All servers are up',
      text: 'All servers are up'
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

}


module.exports = Emailer