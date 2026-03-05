

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const {fileURLTopath} = require('url');
dotenv.config();

const verifiyMail = async (token, email) => {
  try {
    const templatePath = fs.readFileSync(path.join(__dirname, 'Template.hbs'), 'utf-8');

    const template = handlebars.compile(templatePath);
    const htmlToSend = template({ token: encodeURIComponent(token) })


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port:587,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailConfiguration = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verify your email',
      html: htmlToSend,
    };

    await transporter.sendMail(mailConfiguration);
    console.log('Verification email sent');

  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = verifiyMail;
