import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Builder from '@/models/Builder';
import { sendApprovalEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { builderId, adminName } = await request.json();
    
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
    builder.status = 'approved';
    builder.approvedBy = adminName || 'Admin';
    builder.approvedAt = new Date();
    await builder.save();
    
    // Send approval email with temporary password
    const tempPassword = builder.email.split('@')[0] + '123'; // Simple temp password
    await sendApprovalEmail(builder.email, builder.fullName, tempPassword);
    
    return NextResponse.json({
      success: true,
      message: 'Builder approved successfully! Approval email sent.',
    });
    
  } catch (error: any) {
    console.error('Approve builder error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to approve builder' 
      },
      { status: 500 }
    );
  }
}
