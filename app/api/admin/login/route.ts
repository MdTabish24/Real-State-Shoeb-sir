import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { checkRateLimit, getRemainingTime } from '@/lib/ratelimit';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!checkRateLimit(`admin_${email}`, 5, 15 * 60 * 1000)) {
      const remainingTime = Math.ceil(getRemainingTime(`admin_${email}`) / 1000 / 60);
      return NextResponse.json(
        { success: false, error: `Too many login attempts. Try again in ${remainingTime} minutes.` },
        { status: 429 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    if (email !== adminEmail) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$')
      ? await bcrypt.compare(password, adminPassword)
      : password === adminPassword;

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      email: adminEmail,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: { email: adminEmail },
    });

  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
