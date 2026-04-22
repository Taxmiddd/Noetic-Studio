import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Check if the request is coming from the payment subdomain
  if (hostname.startsWith('pay.')) {
    // If accessing the root of the subdomain, maybe redirect or return 404
    if (url.pathname === '/') {
      return new NextResponse('Invoice ID required', { status: 400 });
    }

    // Rewrite pay.noeticstudio.net/123 to /pay/123
    // But avoid rewriting if it's already going to /pay
    if (!url.pathname.startsWith('/pay/')) {
      return NextResponse.rewrite(new URL(`/pay${url.pathname}`, request.url));
    }
  }

  return NextResponse.next();
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
