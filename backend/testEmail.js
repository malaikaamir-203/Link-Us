// testEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

//transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// send test email
async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "apna-personal-email@gmail.com", // yahan apna email daalo
      subject: "Test Email from LinkUs App",
      text: "If you received this, Nodemailer is working fine!",
    });

    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email send error:", err.message);
  }
}

sendTestEmail();
