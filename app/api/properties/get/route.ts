import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Property ID required' }, { status: 400 });
    }
    
    console.log('📋 Fetching property:', id);
    
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    
    const property = { id: docSnap.id, ...docSnap.data() };
    console.log('✅ Property fetched:', property.propertyTitle);
    
    return NextResponse.json({ success: true, property });
    
  } catch (error: any) {
    console.error('❌ Fetch Property Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
