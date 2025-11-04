import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Builder from '@/models/Builder';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Get all pending builders
    const pendingBuilders = await Builder.find({ status: 'pending' })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 }); // Newest first
    
    return NextResponse.json({
      success: true,
      builders: pendingBuilders,
    });
    
  } catch (error: any) {
    console.error('Get pending builders error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch pending builders' 
      },
      { status: 500 }
    );
  }
}
