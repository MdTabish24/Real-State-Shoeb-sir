import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';

// Get all leads
export async function GET() {
  try {
    await connectDB();
    
    const leads = await Lead.find()
      .sort({ createdAt: -1 }) // Newest first
      .limit(100); // Limit to 100 leads
    
    return NextResponse.json({
      success: true,
      leads,
    });
    
  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// Create new lead (from enquiry form)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { name, phone, email, message, propertyId, propertyTitle } = data;
    
    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Create lead
    const lead = await Lead.create({
      name,
      phone,
      email,
      message,
      propertyId,
      propertyTitle,
      status: 'new',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully!',
      leadId: lead._id,
    });
    
  } catch (error: any) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
