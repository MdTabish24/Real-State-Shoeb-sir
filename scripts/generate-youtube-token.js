/**
 * YouTube Refresh Token Generator
 * Run this script once to get your refresh token
 */

const readline = require('readline');
const { google } = require('googleapis');

// Your OAuth2 credentials from .env
const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

console.log('\n🔗 Open this URL in browser:\n');
console.log('https://accounts.google.com/o/oauth2/v2/auth?client_id=' + CLIENT_ID + '&redirect_uri=http://localhost:3000&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload&access_type=offline&prompt=consent');
console.log('\n📋 Copy the code from URL and paste below\n');

process.exit(0);
const REDIRECT_URI = 'http://localhost:3000';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Scopes for YouTube upload
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('\n==============================================');
console.log('YouTube Refresh Token Generator');
console.log('==============================================\n');
console.log('Step 1: Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n');
console.log('Step 2: Authorize the app and copy the code from the URL');
console.log('Step 3: Paste the code below\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n==============================================');
    console.log('✅ SUCCESS! Your tokens:');
    console.log('==============================================\n');
    console.log('REFRESH TOKEN (copy this to .env.local):');
    console.log(tokens.refresh_token);
    console.log('\n');
    console.log('ACCESS TOKEN (temporary, will auto-refresh):');
    console.log(tokens.access_token);
    console.log('\n==============================================\n');
    
  } catch (error) {
    console.error('\n❌ Error getting tokens:', error.message);
  }
  
  rl.close();
});
