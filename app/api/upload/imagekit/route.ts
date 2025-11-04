import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'properties';
    
    console.log('📤 ImageKit Upload - File:', file.name, 'Size:', file.size);
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const result = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: folder,
    });
    
    console.log('✅ ImageKit Upload Success:', result.url);
    
    return NextResponse.json({ 
      success: true, 
      url: result.url,
      fileId: result.fileId 
    });
    
  } catch (error: any) {
    console.error('❌ ImageKit Upload Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
