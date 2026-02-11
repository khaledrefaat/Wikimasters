import { type NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from './src/stack/server';

// Proxy function - runs before request is completed
// Can be exported as named export 'proxy' or as default export
export async function proxy(request: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/handler/sign-in', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/protected/:path*',
};
