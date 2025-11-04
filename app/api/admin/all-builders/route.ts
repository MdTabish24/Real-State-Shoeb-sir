import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Builder from '@/models/Builder';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const details = searchParams.get('details');
    
    if (details === 'true') {
      const builders = await Builder.find({ status: 'approved' }).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, builders });
    }
    
    const count = await Builder.countDocuments({ status: 'approved' });
    
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
