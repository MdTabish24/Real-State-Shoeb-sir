import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Builder from '@/models/Builder';
import { sendRejectionEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { builderId, reason } = await request.json();
    
    if (!builderId) {
      return NextResponse.json(
        { success: false, error: 'Builder ID is required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find builder
    const builder = await Builder.findById(builderId);
    
    if (!builder) {
      return NextResponse.json(
        { success: false, error: 'Builder not found' },
        { status: 404 }
      );
    }
    
    if (builder.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Builder is not pending approval' },
        { status: 400 }
      );
    }
    
    // Update builder status
    builder.status = 'rejected';
    builder.rejectedAt = new Date();
    builder.rejectionReason = reason || 'Application did not meet requirements';
    await builder.save();
    
    // Send rejection email
    await sendRejectionEmail(builder.email, builder.fullName, builder.rejectionReason);
    
    return NextResponse.json({
      success: true,
      message: 'Builder rejected. Rejection email sent.',
    });
    
  } catch (error: any) {
    console.error('Reject builder error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to reject builder' 
      },
      { status: 500 }
    );
  }
}
