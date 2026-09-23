import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { defaultCountry, isValidCountry } from './src/lib/content';

// Root-level routes that must be preserved and ignored by country subpath rewrites
const PRESERVED_ROUTES = ['/admin', '/demo', '/api'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, internal Next.js files, and preserved root routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    PRESERVED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a supported country subpath (/pt or /ie)
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();

  if (isValidCountry(firstSegment)) {
    return NextResponse.next();
  }

  // Redirect root / or unknown paths to default country subpath (/ie)
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultCountry}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static, _next/image
     * - favicon.ico, images, and static assets with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
