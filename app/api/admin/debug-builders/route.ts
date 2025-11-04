import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Builder from '@/models/Builder';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const allBuilders = await Builder.find({});
    const approvedBuilders = await Builder.find({ status: 'approved' });
    const pendingBuilders = await Builder.find({ status: 'pending' });
    
    return NextResponse.json({ 
      success: true, 
      total: allBuilders.length,
      approved: approvedBuilders.length,
      pending: pendingBuilders.length,
      builders: allBuilders.map(b => ({
        id: b._id,
        name: b.fullName,
        email: b.email,
        status: b.status,
        company: b.company?.name
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
