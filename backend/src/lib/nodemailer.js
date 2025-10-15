// src/lib/nodemailer.js
import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Reusable function to send emails
// src/lib/nodemailer.js
// src/lib/nodemailer.js
export const sendVerificationEmail = async (
   to,
  url,
  fullName = "User",
  subject = "Verify Your Email",
  bodyHtml
) => {
  const html = bodyHtml || `
    <p>Hello ${fullName},</p>
    <p>Please click the link below to verify your email:</p>
    <p><a href="${tokenOrUrl}" style="color: #007BFF; text-decoration: underline; font-size: 14px;">
      ${tokenOrUrl}
    </a></p>
    <p>If you didn’t create an account, ignore this email.</p>
    <p><small>This link expires in 24 hours.</small></p>
  `;

  const mailOptions = {
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Could not send email");
  }
};
// Optional: Test function
export const testEmail = async () => {
  try {
    await transporter.sendMail({
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "This is a test email from your app",
    });
    console.log("✅ Test email sent");
  } catch (error) {
    console.error("❌ Test email failed:", error);
  }
};
