import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import OTP from '@/models/OTP';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    
    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      verified: false,
    }).sort({ createdAt: -1 }); // Get latest OTP
    
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'No OTP found. Please request a new one.' },
        { status: 400 }
      );
    }
    
    // Check if expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }
    
    // Check attempts (max 3 attempts)
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 400 }
      );
    }
    
    // Verify OTP
    if (otpRecord.otp !== otp) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      const remainingAttempts = 3 - otpRecord.attempts;
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.` 
        },
        { status: 400 }
      );
    }
    
    // Mark as verified
    otpRecord.verified = true;
    await otpRecord.save();
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!',
    });
    
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to verify OTP. Please try again.' 
      },
      { status: 500 }
    );
  }
}
