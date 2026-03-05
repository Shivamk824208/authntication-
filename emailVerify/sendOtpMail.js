const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

dotenv.config();


const sendOtpEmail = async (otp, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h1>Your OTP code is <b>${otp}</b>. It is valid for 10 minutes.</h1>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.response);

  } catch (err) {
    console.log('Error sending OTP email:', err.message);
    throw new Error('Failed to send OTP email'); // throw error so controller can catch it
  }
};

module.exports = sendOtpEmail;
