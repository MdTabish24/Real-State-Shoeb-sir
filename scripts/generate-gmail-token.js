const { google } = require('googleapis');
const readline = require('readline');

const CLIENT_ID = process.env.GMAIL_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('\n' + '='.repeat(60));
console.log('📧 Gmail + YouTube OAuth Token Generator');
console.log('='.repeat(60));
console.log('\n1. Open this URL in browser:\n');
console.log(authUrl);
console.log('\n2. Authorize the app');
console.log('3. Copy the code from URL and paste below:\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SUCCESS! Add these to .env.local:');
    console.log('='.repeat(60));
    console.log('\nGMAIL_CLIENT_ID=' + (process.env.GMAIL_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID));
    console.log('GMAIL_CLIENT_SECRET=' + (process.env.GMAIL_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET));
    console.log('GMAIL_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('\nYOUTUBE_CLIENT_ID=' + (process.env.GMAIL_CLIENT_ID || process.env.YOUTUBE_CLIENT_ID));
    console.log('YOUTUBE_CLIENT_SECRET=' + (process.env.GMAIL_CLIENT_SECRET || process.env.YOUTUBE_CLIENT_SECRET));
    console.log('YOUTUBE_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('\n' + '='.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  rl.close();
});
