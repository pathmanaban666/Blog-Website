
import cookie from 'cookie';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    response.headers.set('Set-Cookie', cookie.serialize('myCookie', '', {
        httpOnly: true,
        secure: false,
        maxAge: -1, 
        path: '/',
    }));

    return response;
}

export async function OPTIONS() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
