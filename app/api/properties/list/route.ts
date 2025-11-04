import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    console.log('📋 Fetching properties from Firestore...');
    
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '6';
    
    const q = query(
      collection(db, 'properties'),
      orderBy('createdAt', 'desc'),
      limit(parseInt(limitParam))
    );
    
    const snapshot = await getDocs(q);
    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('✅ Properties fetched:', properties.length);
    
    return NextResponse.json({ 
      success: true, 
      properties 
    });
    
  } catch (error: any) {
    console.error('❌ Fetch Properties Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      properties: []
    }, { status: 500 });
  }
}
