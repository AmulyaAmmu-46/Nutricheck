const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Send protein tracking email to user
 * @param {String} email - User email
 * @param {Object} data - Protein tracking data
 * @param {Number} data.requiredProtein - Required protein
 * @param {Number} data.consumedProtein - Consumed protein
 * @param {Number} data.remainingProtein - Remaining protein
 * @param {Buffer} pdfBuffer - Optional PDF buffer containing the meal report
 */
const sendProteinNotification = async (email, data, pdfBuffer = null) => {
  try {
    const transporter = createTransporter();

    const { requiredProtein, consumedProtein, remainingProtein } = data;

    const mailOptions = {
      from: `"Nuricheck" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Daily Protein Tracking - Nuricheck',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .stat-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stat-label { font-size: 14px; color: #666; margin-bottom: 5px; }
            .stat-value { font-size: 32px; font-weight: bold; color: #667eea; }
            .progress-bar { background: #e0e0e0; height: 20px; border-radius: 10px; margin: 10px 0; overflow: hidden; }
            .progress-fill { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; border-radius: 10px; transition: width 0.3s; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍎 Nuricheck Daily Protein Report</h1>
            </div>
            <div class="content">
              <p>Hello!</p>
              <p>Here's your daily protein tracking summary:</p>
              
              <div class="stat-box">
                <div class="stat-label">Daily Protein Requirement</div>
                <div class="stat-value">${requiredProtein}g</div>
              </div>
              
              <div class="stat-box">
                <div class="stat-label">Protein Consumed Today</div>
                <div class="stat-value">${consumedProtein}g</div>
              </div>
              
              <div class="stat-box" style="border: 2px solid ${remainingProtein > 0 ? '#f59e0b' : '#10b981'};">
                <div class="stat-label">Remaining Protein to Reach Goal</div>
                <div class="stat-value" style="color: ${remainingProtein > 0 ? '#d97706' : '#059669'}">
                  ${remainingProtein > 0 ? remainingProtein + 'g' : 'Goal Achieved! ✅'}
                </div>
                ${remainingProtein > 0 ? `<div style="font-size: 14px; color: #d97706; margin-top: 5px;">Keep going! You can do it! 💪</div>` : ''}
              </div>
              
              <div style="margin-top: 20px;">
                <div class="stat-label">Daily Progress</div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${Math.min((consumedProtein / requiredProtein) * 100, 100)}%"></div>
                </div>
                <div style="text-align: center; margin-top: 5px; color: #666;">
                  ${Math.round((consumedProtein / requiredProtein) * 100)}% of your daily goal
                </div>
              </div>
              
              <p style="margin-top: 30px; text-align: center; font-style: italic; color: #555;">
                "${remainingProtein > 0
          ? `Remember, consistency is key! You have ${remainingProtein}g left for today.`
          : 'Fantastic job hitting your protein target today! Your muscles thank you.'}"
              </p>
              
              <div class="footer">
                <p>Stay healthy with Nuricheck!</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `Nuricheck_Meal_Report_${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    throw error;
  }
};

/**
 * Send password reset OTP email
 * @param {String} email - User email
 * @param {String} otp - The reset OTP 
 */
const sendPasswordResetOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Nuricheck" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset OTP - Nuricheck',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border: 2px dashed #a855f7; }
            .otp-value { font-size: 40px; font-weight: bold; letter-spacing: 5px; color: #0ea5e9; font-family: monospace; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍎 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset the password for your Nuricheck account.</p>
              
              <div class="otp-box">
                <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Your 6-digit Verification Code:</div>
                <div class="otp-value">${otp}</div>
              </div>
              
              <p style="margin-top: 20px;">This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
              
              <div class="footer">
                <p>Stay healthy with Nuricheck!</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Reset Password Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Reset Password Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendProteinNotification,
  sendPasswordResetOTP,
  createTransporter
};



