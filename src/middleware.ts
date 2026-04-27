import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = url.hostname;

  // 🔒 Security Headers - Applied to all responses
  const response = NextResponse.next();
  
  // Content Security Policy - prevents XSS attacks
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.lemonsqueezy.com blob:; frame-src 'self' https://buy.lemonsqueezy.com blob:; object-src 'none'; base-uri 'self'; form-action 'self';"
  );

  // Prevents clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevents MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Enforces HTTPS
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Referrer policy for privacy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );

  // Check if the request is coming from the payment subdomain
  if (hostname.startsWith('pay.')) {
    // Rewrite pay.noeticstudio.net/ to /pay (landing page)
    // Rewrite pay.noeticstudio.net/123 to /pay/123
    if (!url.pathname.startsWith('/pay')) {
      const rewritePath = url.pathname === '/' ? '/pay' : `/pay${url.pathname}`;
      return NextResponse.rewrite(new URL(rewritePath, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, apple-icon.svg (static assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
