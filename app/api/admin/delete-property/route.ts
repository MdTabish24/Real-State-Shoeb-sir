import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { verifyAdmin } from '@/lib/auth';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();
    
    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Fetch property data to get image URLs
    const propertyDoc = await getDoc(doc(db, 'properties', propertyId));
    
    if (!propertyDoc.exists()) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    const propertyData = propertyDoc.data();
    const imageUrls = propertyData.images || [];

    // Delete images from ImageKit
    for (const imageUrl of imageUrls) {
      try {
        // Extract fileId from ImageKit URL
        const fileIdMatch = imageUrl.match(/\/([^\/]+)\?/);
        if (fileIdMatch && fileIdMatch[1]) {
          const fileId = fileIdMatch[1];
          await imagekit.deleteFile(fileId);
          console.log('✅ Deleted image from ImageKit:', fileId);
        }
      } catch (error) {
        console.error('⚠️ Failed to delete image from ImageKit:', error);
      }
    }

    // Delete property from Firebase
    await deleteDoc(doc(db, 'properties', propertyId));

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
    });

  } catch (error: any) {
    console.error('Delete property error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
