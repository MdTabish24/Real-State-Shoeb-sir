import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { verifyAdmin } from '@/lib/auth';

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
