import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Builder from '@/models/Builder';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Find builder
    const builder = await Builder.findOne({ email: email.toLowerCase() });
    
    if (!builder) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check if approved
    if (builder.status === 'pending') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Your account is pending admin approval. Please wait for approval email.' 
        },
        { status: 403 }
      );
    }
    
    if (builder.status === 'rejected') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Your account has been rejected. Please contact support.' 
        },
        { status: 403 }
      );
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, builder.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Return builder data (without password)
    const builderData = {
      id: builder._id,
      email: builder.email,
      fullName: builder.fullName,
      phone: builder.phone,
      company: builder.company,
      status: builder.status,
    };
    
    return NextResponse.json({
      success: true,
      message: 'Login successful!',
      builder: builderData,
    });
    
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}
