/**
 * 🔒 Authentication utilities
 * Handles admin authentication via Supabase Auth
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Verify admin authorization
 * Only specific email addresses are admin
 */
export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean);
  
  return adminEmails.includes(email);
}

/**
 * Middleware to protect API routes
 * Returns 401 if not authenticated admin
 */
export async function requireAdminAuth(request: NextRequest) {
  // Get the auth token from headers
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      authenticated: false,
      error: NextResponse.json(
        { error: 'Missing authentication' },
        { status: 401 }
      ),
    };
  }

  // In a real implementation, verify the token with Supabase
  // For now, we'll check the session via server-side validation
  try {
    // TODO: Implement proper token verification
    // This is a placeholder - use Supabase Admin SDK to verify
    return {
      authenticated: true,
      user: null,
    };
  } catch (error) {
    console.error('[Token Verification Error]:', error);
    return {
      authenticated: false,
      error: NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      ),
    };
  }
}

/**
 * Validate CORS origin
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://noeticstudio.net',
    'https://www.noeticstudio.net',
    'https://pay.noeticstudio.net',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  if (!origin) return true; // Allow same-origin requests
  return allowedOrigins.includes(origin);
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(response: NextResponse, origin?: string) {
  if (!origin) return response;
  
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}
