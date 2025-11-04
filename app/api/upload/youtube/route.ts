import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  'http://localhost:3000'
);

oauth2Client.setCredentials({
  refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl',
});

// Refresh access token
oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    console.log('🔄 New refresh token:', tokens.refresh_token);
  }
  console.log('🔑 New access token received');
});

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

export async function PATCH(request: Request) {
  try {
    const { videoId } = await request.json();
    await youtube.videos.update({
      part: ['status'],
      requestBody: {
        id: videoId,
        status: {
          privacyStatus: 'unlisted',
          embeddable: true,
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || 'Property Video';
    
    console.log('📤 YouTube Upload - File:', file.name, 'Size:', file.size);
    
    // Refresh access token with proper scopes
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      console.log('🔑 Access token refreshed');
    } catch (refreshError: any) {
      console.error('❌ Token refresh failed:', refreshError.message);
      throw new Error('YouTube authentication failed. Please re-authorize the app.');
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title,
          description: 'Property video uploaded via EstateHub',
        },
        status: {
          privacyStatus: 'unlisted',
          embeddable: true,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: require('stream').Readable.from(buffer),
      },
    });
    
    const videoId = response.data.id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    console.log('✅ YouTube Upload Success:', videoUrl);
    
    return NextResponse.json({ 
      success: true, 
      url: videoUrl,
      videoId: videoId 
    });
    
  } catch (error: any) {
    console.error('❌ YouTube Upload Error:', error.message);
    console.error('Full error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
