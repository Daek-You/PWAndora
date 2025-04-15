const { sendEmailsToManagers } = require('../services/email/emailService')

const sendEmail = async (req, res) => {
  console.log('Email sending initiated')
  try {
    await sendEmailsToManagers()
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message })
  }
}

module.exports = { sendEmail }
