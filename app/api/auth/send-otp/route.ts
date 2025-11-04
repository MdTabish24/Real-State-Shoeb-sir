import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import OTP from '@/models/OTP';
import Builder from '@/models/Builder';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if builder already exists
    const existingBuilder = await Builder.findOne({ email: email.toLowerCase() });
    if (existingBuilder) {
      return NextResponse.json(
        { success: false, error: 'Email already registered. Please login instead.' },
        { status: 400 }
      );
    }
    
    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: email.toLowerCase() });
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
    
    // Send OTP via email
    await sendOTPEmail(email, otp);
    
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully! Please check your email.',
    });
    
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to send OTP. Please try again.' 
      },
      { status: 500 }
    );
  }
}
