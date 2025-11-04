# 📧 Gmail API Setup (5 minutes)

## Why Gmail API?
✅ FREE - 500 emails/day quota
✅ Works on Render (HTTPS API)
✅ Same OAuth as YouTube (reuse credentials)
✅ Auto token refresh (never expires)
✅ Built-in rate limiting

## Setup Steps:

### Step 1: Enable Gmail API (1 min)
1. Go to: https://console.cloud.google.com/apis/library
2. Search "Gmail API"
3. Click "Enable"

### Step 2: Add Gmail Scope to OAuth (1 min)
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Add scope: `https://www.googleapis.com/auth/gmail.send`
4. Save

### Step 3: Generate Refresh Token (2 min)

Run this script:
```bash
cd real-estate-platform
node scripts/generate-gmail-token.js
```

Follow the URL, authorize, paste code back.

### Step 4: Update .env.local (1 min)
```env
GMAIL_CLIENT_ID=same_as_youtube_client_id
GMAIL_CLIENT_SECRET=same_as_youtube_client_secret
GMAIL_REFRESH_TOKEN=paste_generated_token_here
```

## Features Implemented:

✅ **Auto Token Refresh** - Token never expires
✅ **Rate Limiting** - 500 emails/day max
✅ **Throttling** - Max 2 emails/second
✅ **Error Handling** - Graceful failures

## Testing:

```bash
npm run dev
# Try builder registration - OTP email jayega!
```

## Production:
Same credentials work on Render - just add to environment variables!

Total time: 5 minutes ⏱️
