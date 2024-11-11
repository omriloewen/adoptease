// In utils/email.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // or another email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "בקשה לאיפוס סיסמא",
    html: `<p>לאיפוס הסיסמא לחשבון באתר adoptease, היכנסו לקישור הבא:</p>
           <a href="${resetLink}">אפס סיסמא</a>
           <p>אם לא ביקשתם לאפס את הסיסמא, נא התעלמו מהודעה זו.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

module.exports = sendResetEmail;
