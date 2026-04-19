const nodemailer = require('nodemailer');

// Check if email credentials are configured
const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD;

let transporter = null;

if (emailConfigured) {
  // Configure email transporter only if credentials exist
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  console.warn('⚠️  Email credentials not configured. Password reset emails will not be sent.');
  console.warn('Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
}

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  // Check if email is properly configured
  if (!emailConfigured) {
    console.error('Email service not configured. Cannot send reset email.');
    return { 
      success: false, 
      error: 'Email service not configured. Please contact the administrator.' 
    };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - TheFolio',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your TheFolio account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}" style="
        display: inline-block;
        background-color: #59B2f4;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin: 20px 0;
        font-weight: bold;
      ">Reset Password</a>
      <p>Or copy and paste this link in your browser:</p>
      <p><code>${resetLink}</code></p>
      <p><strong>This link will expire in 1 hour.</strong></p>
      <p>If you did not request a password reset, please ignore this email and your account will remain secure.</p>
      <hr>
      <p style="color: #888; font-size: 12px;">TheFolio - Web Development Portfolio</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPasswordResetEmail };
