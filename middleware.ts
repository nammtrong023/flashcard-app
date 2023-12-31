import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const publicPath =
        path === '/sign-in' ||
        path === '/sign-up' ||
        path === '/verify/email' ||
        path === '/verify/otp';

    const accessToken = request.cookies.get('access')?.value || '';

    let isExpired = true;

    const user = accessToken && jwt.decode(accessToken);

    if (user && typeof user !== 'string' && user.exp) {
        isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    }

    if (publicPath && !isExpired) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (!publicPath && isExpired) {
        return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
    }
}

export const config = {
    matcher: [
        '/',
        '/sign-in',
        '/sign-up',
        '/verify/:path*',
        '/u/:path*',
        '/flashcards/:path*',
        '/classes/:path*',
    ],
};
