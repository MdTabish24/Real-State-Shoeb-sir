import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Auto-refresh token when expired
oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    console.log('🔄 New refresh token:', tokens.refresh_token);
  }
  console.log('✅ Access token auto-refreshed');
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Rate limiting: 500 emails per day, max 2 per second
let emailsSentToday = 0;
let lastResetDate = new Date().toDateString();
let lastEmailTime = 0;

function checkRateLimit() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    emailsSentToday = 0;
    lastResetDate = today;
  }
  
  if (emailsSentToday >= 500) {
    throw new Error('Daily email limit reached (500/day)');
  }
  emailsSentToday++;
}

async function throttle() {
  const now = Date.now();
  const timeSinceLastEmail = now - lastEmailTime;
  
  if (timeSinceLastEmail < 500) {
    await new Promise(resolve => setTimeout(resolve, 500 - timeSinceLastEmail));
  }
  
  lastEmailTime = Date.now();
}

function createEmailMessage(to: string, subject: string, html: string) {
  const message = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    html
  ].join('\n');

  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sendOTPEmail(email: string, otp: string) {
  try {
    checkRateLimit();
    await throttle();
    
    // Refresh access token
    await oauth2Client.getAccessToken();
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0a2540;">🏠 EstateHub - Email Verification</h2>
        <p>Your OTP code for builder registration is:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0a2540;">${otp}</span>
        </div>
        <p style="color: #666;">⏰ This code will expire in 5 minutes.</p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    const encodedMessage = createEmailMessage(email, 'Your OTP for EstateHub Builder Registration', html);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('✅ OTP email sent to:', email, `(${emailsSentToday}/500 today)`);
    return true;
  } catch (error: any) {
    console.error('❌ Email error:', error.message);
    throw new Error('Failed to send OTP email');
  }
}

export async function sendApprovalEmail(email: string, name: string, password: string) {
  try {
    checkRateLimit();
    await throttle();
    
    await oauth2Client.getAccessToken();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">✅ Account Approved!</h2>
        <p>Congratulations, <strong>${name}</strong>!</p>
        <p>Your builder account has been approved.</p>
        <div style="background: #f0f0f0; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="margin-top: 0;">Login Credentials:</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/builder" style="display: inline-block; background: #0a2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">Login Now</a>
        </div>
        <p style="color: #ef4444;">⚠️ Change your password after first login.</p>
      </div>
    `;

    const encodedMessage = createEmailMessage(email, '✅ Your EstateHub Builder Account is Approved!', html);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('✅ Approval email sent to:', email, `(${emailsSentToday}/500 today)`);
    return true;
  } catch (error: any) {
    console.error('❌ Email error:', error.message);
    throw new Error('Failed to send approval email');
  }
}

export async function sendRejectionEmail(email: string, name: string, reason?: string) {
  try {
    checkRateLimit();
    await throttle();
    
    await oauth2Client.getAccessToken();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ef4444;">Application Update</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We regret to inform you that we cannot approve your builder account at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>If you believe this is an error, please contact our support team.</p>
        <p style="color: #666; margin-top: 30px;">Best regards,<br>EstateHub Team</p>
      </div>
    `;

    const encodedMessage = createEmailMessage(email, 'EstateHub Builder Application Update', html);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('✅ Rejection email sent to:', email, `(${emailsSentToday}/500 today)`);
    return true;
  } catch (error: any) {
    console.error('❌ Email error:', error.message);
    throw new Error('Failed to send rejection email');
  }
}
