const { createTransporter } = require('../config/email');

const primaryColor = '#01596D';
const accentColor = '#F3D646';

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Trebuchet MS', Arial, sans-serif; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background-color: ${primaryColor}; padding: 30px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; }
    .header span { color: ${accentColor}; }
    .body { padding: 40px; color: #444444; line-height: 1.6; }
    .body h2 { color: ${primaryColor}; margin-top: 0; }
    .btn { display: inline-block; background-color: ${primaryColor}; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 20px 0; }
    .btn-accent { background-color: ${accentColor}; color: ${primaryColor} !important; }
    .divider { border: none; border-top: 1px solid #eeeeee; margin: 24px 0; }
    .footer { background-color: #f8f8f8; padding: 20px 40px; text-align: center; color: #888888; font-size: 13px; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; }
    .badge-accepted { background-color: #dcfce7; color: #166534; }
    .badge-rejected { background-color: #fee2e2; color: #991b1b; }
    .badge-pending { background-color: #fef9c3; color: #854d0e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Opportunity <span>Hub</span></h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Opportunity Hub | Connecting Refugees to Opportunities</p>
      <p>This email was sent automatically. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

const sendWelcomeEmail = async (user) => {
  const html = baseTemplate(`
    <h2>Welcome to Opportunity Hub! 🎉</h2>
    <p>Hello <strong>${user.fullName || user.email}</strong>,</p>
    <p>We're thrilled to have you join <strong>Opportunity Hub</strong> — your gateway to jobs, scholarships, grants, training programs, fellowships, and internships.</p>
    <p>Your account has been created successfully. Start exploring opportunities that can transform your future.</p>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL}/opportunities" class="btn">Browse Opportunities</a>
    </div>
    <hr class="divider">
    <p style="color:#888; font-size:13px;">If you did not create this account, please ignore this email.</p>
  `);
  await sendEmail({ to: user.email, subject: 'Welcome to Opportunity Hub!', html });
};

const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = baseTemplate(`
    <h2>Verify Your Email Address</h2>
    <p>Hello <strong>${user.fullName || user.email}</strong>,</p>
    <p>Please verify your email address to activate your account and access all features.</p>
    <div style="text-align:center;">
      <a href="${verifyUrl}" class="btn">Verify Email Address</a>
    </div>
    <p>Or copy this link: <a href="${verifyUrl}" style="color:${primaryColor};">${verifyUrl}</a></p>
    <p style="color:#888; font-size:13px;">This link expires in 24 hours. If you did not register, ignore this email.</p>
  `);
  await sendEmail({ to: user.email, subject: 'Verify Your Email - Opportunity Hub', html });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = baseTemplate(`
    <h2>Reset Your Password</h2>
    <p>Hello <strong>${user.fullName || user.email}</strong>,</p>
    <p>You requested to reset your password. Click the button below to set a new password:</p>
    <div style="text-align:center;">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div>
    <p>Or copy this link: <a href="${resetUrl}" style="color:${primaryColor};">${resetUrl}</a></p>
    <p style="color:#888; font-size:13px;">This link expires in 1 hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
  `);
  await sendEmail({ to: user.email, subject: 'Password Reset Request - Opportunity Hub', html });
};

const sendApplicationSubmittedEmail = async (user, opportunity) => {
  const html = baseTemplate(`
    <h2>Application Submitted Successfully!</h2>
    <p>Hello <strong>${user.fullName || user.email}</strong>,</p>
    <p>Your application for the following opportunity has been received:</p>
    <div style="background:#f0f9fb; border-left:4px solid ${primaryColor}; padding:16px 20px; border-radius:0 8px 8px 0; margin:16px 0;">
      <strong style="color:${primaryColor}; font-size:18px;">${opportunity.title}</strong><br>
      <span style="color:#666;">📍 ${opportunity.location} &nbsp;|&nbsp; 📅 Deadline: ${new Date(opportunity.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </div>
    <p>The organization will review your application and get back to you. You can track the status of your application on your dashboard.</p>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL}/refugee/applications" class="btn">View My Applications</a>
    </div>
  `);
  await sendEmail({ to: user.email, subject: `Application Submitted: ${opportunity.title}`, html });
};

const sendApplicationAcceptedEmail = async (user, opportunity, notes) => {
  const html = baseTemplate(`
    <h2>🎉 Congratulations! Your Application Was Accepted</h2>
    <p>Hello <strong>${user.fullName || user.email}</strong>,</p>
    <p>We have great news! Your application for the following opportunity has been <span class="badge badge-accepted">Accepted</span>:</p>
    <div style="background:#f0f9fb; border-left:4px solid #166534; padding:16px 20px; border-radius:0 8px 8px 0; margin:16px 0;">
      <strong style="color:${primaryColor}; font-size:18px;">${opportunity.title}</strong><br>
      <span style="color:#666;">📍 ${opportunity.location}</span>
    </div>
    ${notes ? `<p><strong>Message from the organization:</strong><br>${notes}</p>` : ''}
    <p>Please check your dashboard for next steps and contact the organization for further instructions.</p>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL}/refugee/applications" class="btn btn-accent">View Application</a>
    </div>
  `);
  await sendEmail({ to: user.email, subject: `Application Accepted: ${opportunity.title} 🎉`, html });
};

const sendApplicationRejectedEmail = async (user, opportunity, notes) => {
  const html = baseTemplate(`
    <h2>Application Status Update</h2>
    <p>Hello <strong>${user.fullName || user.email}</strong>,</p>
    <p>Thank you for applying to the following opportunity. After careful review, we regret to inform you that your application was not selected at this time:</p>
    <div style="background:#fef2f2; border-left:4px solid #991b1b; padding:16px 20px; border-radius:0 8px 8px 0; margin:16px 0;">
      <strong style="color:${primaryColor}; font-size:18px;">${opportunity.title}</strong>
    </div>
    ${notes ? `<p><strong>Feedback from the organization:</strong><br>${notes}</p>` : ''}
    <p>Don't be discouraged — there are many more opportunities waiting for you. Keep exploring and applying!</p>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL}/opportunities" class="btn">Find More Opportunities</a>
    </div>
  `);
  await sendEmail({ to: user.email, subject: `Application Update: ${opportunity.title}`, html });
};

const sendOrganizationVerifiedEmail = async (user, orgName) => {
  const html = baseTemplate(`
    <h2>Your Organization Has Been Verified! ✅</h2>
    <p>Hello <strong>${user.fullName || user.email}</strong>,</p>
    <p>Great news! <strong>${orgName}</strong> has been verified on Opportunity Hub. You can now post opportunities and connect with qualified candidates.</p>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL}/org/opportunities/create" class="btn">Post Your First Opportunity</a>
    </div>
  `);
  await sendEmail({ to: user.email, subject: 'Organization Verified - Opportunity Hub', html });
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendApplicationSubmittedEmail,
  sendApplicationAcceptedEmail,
  sendApplicationRejectedEmail,
  sendOrganizationVerifiedEmail,
};
