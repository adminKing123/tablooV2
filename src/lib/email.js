import nodemailer from 'nodemailer';

/**
 * Create email transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
}

/**
 * Send OTP verification email
 * @param {string} to - Recipient email address
 * @param {string} firstName - User's first name
 * @param {string} otpCode - OTP code
 */
export async function sendOTPEmail(to, firstName, otpCode) {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Tabloo'}" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Verify Your Email - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0; text-align: center;">
                  <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Welcome to ${process.env.APP_NAME || 'Tabloo'}!</h1>
                        <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                          Hi ${firstName},
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                          Thank you for signing up! Please use the following OTP code to verify your email address:
                        </p>
                        <div style="background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                          <div style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otpCode}
                          </div>
                        </div>
                        <p style="color: #666666; font-size: 14px; line-height: 20px; margin: 0 0 10px 0;">
                          This code will expire in <strong>10 minutes</strong>.
                        </p>
                        <p style="color: #999999; font-size: 12px; line-height: 18px; margin: 20px 0 0 0;">
                          If you didn't request this code, please ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8f9fa; padding: 20px 30px; border-radius: 0 0 8px 8px;">
                        <p style="color: #999999; font-size: 12px; margin: 0; text-align: center;">
                          © ${new Date().getFullYear()} ${process.env.APP_NAME || 'Tabloo'}. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Hi ${firstName},\n\nThank you for signing up for ${process.env.APP_NAME || 'Tabloo'}!\n\nYour OTP verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Send welcome email after successful verification
 * @param {string} to - Recipient email address
 * @param {string} firstName - User's first name
 */
export async function sendWelcomeEmail(to, firstName) {  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Tabloo'}" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Welcome to Tabloo!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Welcome</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0; text-align: center;">
                  <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center;">
                        <h1 style="color: #28a745; font-size: 28px; margin: 0 0 20px 0;">🎉 Welcome Aboard!</h1>
                        <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                          Hi ${firstName},
                        </p>
                        <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                          Your email has been successfully verified! You're all set to explore ${process.env.APP_NAME || 'Tabloo'}.
                        </p>
                        <a href="${process.env.APP_URL}/login" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 16px; margin: 20px 0;">
                          Get Started
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Welcome email error:', error);
    // Don't throw error for welcome email - it's not critical
  }
}

/**
 * Send password reset OTP email.
 * @param {string} to        — Recipient email address
 * @param {string} firstName — User's first name
 * @param {string} otpCode   — 6-digit reset code
 */
export async function sendPasswordResetEmail(to, firstName, otpCode) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Tabloo'}" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Reset Your Password — Tabloo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0; text-align: center;">
                  <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px;">
                        <div style="text-align: center; margin-bottom: 24px;">
                          <div style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 12px; padding: 12px 20px;">
                            <span style="color: #ffffff; font-size: 20px; font-weight: bold;">T</span>
                          </div>
                        </div>
                        <h1 style="color: #1e293b; font-size: 22px; margin: 0 0 16px 0; text-align: center;">Reset your password</h1>
                        <p style="color: #64748b; font-size: 15px; line-height: 24px; margin: 0 0 16px 0;">
                          Hi ${firstName},
                        </p>
                        <p style="color: #64748b; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                          We received a request to reset your password. Use the code below to complete the reset. This code expires in <strong>10 minutes</strong>.
                        </p>
                        <div style="background-color: #f1f5f9; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px 0;">
                          <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">Your reset code</p>
                          <div style="font-size: 38px; font-weight: 700; color: #4f46e5; letter-spacing: 10px; font-family: 'Courier New', monospace;">
                            ${otpCode}
                          </div>
                        </div>
                        <p style="color: #94a3b8; font-size: 13px; line-height: 20px; margin: 0;">
                          If you didn&apos;t request a password reset, you can safely ignore this email. Your password will not change.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px 30px; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
                          &copy; ${new Date().getFullYear()} ${process.env.APP_NAME || 'Tabloo'}. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Hi ${firstName},\n\nYour password reset code is: ${otpCode}\n\nThis code expires in 10 minutes.\n\nIf you didn't request a password reset, ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Password reset email error:', error);
    throw new Error('Failed to send password reset email');
  }
}
