const { UserRepository } = require('../../repositories/UserRepository')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const { EMAIL, PASSWORD, EMAIL_SERVICE } = process.env

async function sendEmail(recipient, subject,  html) {
  console.log('Sending email to: ', recipient)
  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL, // Your email
      pass: PASSWORD, // Generate App Password from Google
    },
  })

  const mailOptions = {
    from: EMAIL,
    to: recipient,
    subject: subject,
    html: html
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${recipient}: `, info.response)
  } catch (error) {
    console.error(`Error sending email to ${recipient}: `, error)
  }
}

async function sendEmailsToManagers() {
  const managers = await UserRepository.findAllEmail()
  const subject = 'PWAndora Health manager: CRAWLER STOPPED'

  for (const manager of managers) {
    if (!manager.email) {
      console.log('No email found for manager:', manager)
      console.log(manager.getDataValue('email'))
      continue
    }
    const html = `Crawler has stopped for more than 10 minutes.
      Please check the site.
      <a href="https://j12s005.p.ssafy.io/monitor/dashboard">PWAndora</a>`
    sendEmail(manager.email, subject, html)
  }
}

module.exports = { sendEmail, sendEmailsToManagers }
