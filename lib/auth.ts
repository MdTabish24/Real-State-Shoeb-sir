import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: any, expiresIn: string = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = verifyToken(token) as any;
  if (!decoded || decoded.role !== 'admin') return null;
  
  return decoded;
}

export async function verifyBuilder(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  const decoded = verifyToken(token) as any;
  if (!decoded || decoded.role !== 'builder') return null;
  
  return decoded;
}
