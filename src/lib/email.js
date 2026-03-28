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

/**
 * Send password reset confirmation email after a successful reset.
 * @param {string} to        — Recipient email address
 * @param {string} firstName — User's first name
 */
export async function sendPasswordResetConfirmationEmail(to, firstName) {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.APP_NAME || 'Tabloo'}" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Your password has been reset — Tabloo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Successful</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 40px 0; text-align: center;">
                  <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center;">
                        <div style="margin-bottom: 24px;">
                          <div style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 12px; padding: 12px 20px;">
                            <span style="color: #ffffff; font-size: 20px; font-weight: bold;">T</span>
                          </div>
                        </div>
                        <div style="width: 56px; height: 56px; background-color: #dcfce7; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 28px;">✓</span>
                        </div>
                        <h1 style="color: #1e293b; font-size: 22px; margin: 0 0 12px 0;">Password reset successfully</h1>
                        <p style="color: #64748b; font-size: 15px; line-height: 24px; margin: 0 0 24px 0;">
                          Hi ${firstName}, your password for your ${process.env.APP_NAME || 'Tabloo'} account has been changed successfully.
                        </p>
                        <a href="${process.env.APP_URL || 'http://localhost:3000'}/login" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; margin-bottom: 24px;">
                          Sign in to your account
                        </a>
                        <p style="color: #94a3b8; font-size: 13px; line-height: 20px; margin: 0;">
                          If you didn&apos;t make this change, please contact support immediately.
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
      text: `Hi ${firstName},\n\nYour password has been reset successfully.\n\nIf you didn't make this change, contact support immediately.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Password reset confirmation email error:', error);
    // Non-critical — don't throw
  }
}

/**
 * Send a project invitation email.
 *
 * @param {string} to            — Invitee's email address
 * @param {object} opts
 * @param {string} opts.inviterName   — Full name of the person sending the invite
 * @param {string} opts.projectName   — Project name
 * @param {string} opts.projectColor  — Project accent colour (hex)
 * @param {string} opts.projectIcon   — Project emoji icon
 * @param {string} opts.role          — Role being granted (e.g. 'Member')
 * @param {string} opts.acceptUrl     — Full URL to the /invite/[token] page
 * @param {number} opts.expiryDays    — Days until the invitation expires
 * @param {boolean} opts.userExists   — Whether the invitee already has an account
 */
export async function sendProjectInvitationEmail(to, {
  inviterName,
  projectName,
  projectColor,
  projectIcon,
  role,
  acceptUrl,
  expiryDays,
  userExists,
}) {
  try {
    const transporter = createTransporter();
    const appName = process.env.APP_NAME || 'Tabloo';
    const ctaLabel = userExists ? 'Accept Invitation' : 'Create Account & Accept';

    const mailOptions = {
      from: `"${appName}" <${process.env.SMTP_USER}>`,
      to,
      subject: `${inviterName} invited you to join "${projectName}" on ${appName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Invitation</title>
          </head>
          <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f1f5f9;">
            <table role="presentation" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:40px 0;text-align:center;">
                  <table role="presentation" style="width:560px;margin:0 auto;background:#ffffff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;">

                    <!-- Header bar -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:28px 32px;text-align:center;">
                        <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 18px;">
                          <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-0.5px;">${appName}</span>
                        </div>
                      </td>
                    </tr>

                    <!-- Project card -->
                    <tr>
                      <td style="padding:32px 32px 24px;">
                        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;display:flex;align-items:center;gap:16px;margin-bottom:24px;">
                          <div style="width:52px;height:52px;border-radius:14px;background:${projectColor};display:inline-flex;align-items:center;justify-content:center;font-size:28px;line-height:1;flex-shrink:0;">
                            ${projectIcon}
                          </div>
                          <div>
                            <p style="margin:0 0 2px;font-size:18px;font-weight:700;color:#0f172a;">${projectName}</p>
                            <p style="margin:0;font-size:13px;color:#64748b;">You've been invited as <strong>${role}</strong></p>
                          </div>
                        </div>

                        <p style="color:#334155;font-size:16px;line-height:26px;margin:0 0 8px;">
                          <strong>${inviterName}</strong> has invited you to collaborate on
                          <strong>${projectName}</strong>.
                        </p>
                        ${!userExists ? `
                        <div style="background:#fefce8;border:1px solid #fde047;border-radius:8px;padding:12px 16px;margin:16px 0;">
                          <p style="margin:0;font-size:13px;color:#854d0e;">
                            <strong>New to ${appName}?</strong> You'll need to create a free account first.
                            Your invitation will be waiting for you after you sign up.
                          </p>
                        </div>` : ''}

                        <!-- CTA button -->
                        <div style="text-align:center;margin:28px 0 20px;">
                          <a href="${acceptUrl}"
                             style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;letter-spacing:0.1px;">
                            ${ctaLabel}
                          </a>
                        </div>

                        <p style="text-align:center;color:#94a3b8;font-size:12px;margin:0 0 4px;">
                          Or copy this link into your browser:
                        </p>
                        <p style="text-align:center;margin:0;">
                          <a href="${acceptUrl}" style="color:#6366f1;font-size:12px;word-break:break-all;">${acceptUrl}</a>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center;">
                        <p style="margin:0;color:#94a3b8;font-size:12px;">
                          This invitation expires in <strong>${expiryDays} day${expiryDays !== 1 ? 's' : ''}</strong>.
                          If you didn't expect this, you can safely ignore it.
                        </p>
                        <p style="margin:8px 0 0;color:#cbd5e1;font-size:11px;">
                          &copy; ${new Date().getFullYear()} ${appName}. All rights reserved.
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
      text: `${inviterName} invited you to join "${projectName}" on ${appName}.\n\nYou've been invited as: ${role}\n\nAccept invitation: ${acceptUrl}\n\nThis invitation expires in ${expiryDays} day(s).`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Project invitation email error:', error);
    // Non-critical — caller uses fire-and-forget
  }
}
