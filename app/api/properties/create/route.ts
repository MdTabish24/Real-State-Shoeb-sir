import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { verifyBuilder } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const builder = await verifyBuilder(request);
    if (!builder) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login as builder.' },
        { status: 401 }
      );
    }

    const propertyData = await request.json();
    
    console.log('📝 Creating Property in Firestore:', propertyData.propertyTitle);
    
    const docRef = await addDoc(collection(db, 'properties'), {
      ...propertyData,
      builderId: builder.id,
      builderEmail: builder.email,
      createdAt: serverTimestamp(),
      status: 'active',
    });
    
    console.log('✅ Property Created - ID:', docRef.id);
    
    return NextResponse.json({ 
      success: true, 
      propertyId: docRef.id,
      message: 'Property listed successfully!' 
    });
    
  } catch (error: any) {
    console.error('❌ Property Creation Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
