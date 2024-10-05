import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';


export async function middleware(req) {
    const { pathname } = req.nextUrl;

    const allowedPaths = [
        '/Home',
        '/About',
        '/BlogPost',
        '/Contact',
        '/Profile',
        '/404',
        '/Login',
        '/'
    ];

    if (pathname.startsWith('/_next/static') || pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const token = req.cookies.get('myCookie')?.value;

    if (!token) {
        if (pathname !== '/Login') {
            return NextResponse.redirect(new URL('/Login', req.url));
        }
    } else {
        try {
          const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT);
          const { payload } = await jwtVerify(token, secret);
          req.user = payload;
            if (pathname === '/Login') {
                return NextResponse.redirect(new URL('/Home', req.url));
            }
        } catch (err) {
            console.log(err)
            if (pathname !== '/Login') {
              return NextResponse.redirect(new URL('/Login', req.url));
          }
        }
    }
    if (pathname.startsWith('/post/')) {
        const postId = pathname.split('/post/')[1];
        if (!postId || !isValidObjectId(postId)) {
            return NextResponse.redirect(new URL('/404', req.url));
        }
        return NextResponse.next();
    }
    if (!allowedPaths.includes(pathname)) {
        return NextResponse.redirect(new URL('/404', req.url));
    }

    return NextResponse.next();
}

function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

export const config = {
    matcher: ['/:path*'], 
};



