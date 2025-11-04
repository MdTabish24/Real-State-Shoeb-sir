import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Builder from '@/models/Builder';
import OTP from '@/models/OTP';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const {
      email,
      password,
      fullName,
      phone,
      companyName,
      companyAddress,
      gstNumber,
      panNumber,
    } = data;
    
    // Validate required fields
    if (!email || !password || !fullName || !phone || !companyName || !gstNumber || !panNumber) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Check if email was verified
    const verifiedOTP = await OTP.findOne({
      email: email.toLowerCase(),
      verified: true,
    }).sort({ createdAt: -1 });
    
    if (!verifiedOTP) {
      return NextResponse.json(
        { success: false, error: 'Email not verified. Please verify your email first.' },
        { status: 400 }
      );
    }
    
    // Check if builder already exists
    const existingBuilder = await Builder.findOne({ email: email.toLowerCase() });
    if (existingBuilder) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create builder
    const builder = await Builder.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      phone,
      company: {
        name: companyName,
        address: companyAddress,
        gstNumber,
        panNumber,
      },
      emailVerified: true,
      status: 'pending',
    });
    
    // Clean up OTP
    await OTP.deleteMany({ email: email.toLowerCase() });
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval.',
      builderId: builder._id,
    });
    
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}
