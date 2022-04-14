import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { LOGIN_URL } from '../constants';

export async function middleware(req: any) {

  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;
  console.log(pathname)

  // Allow the requests if the following true
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
  }

  // If not, redirect to login
  if(!token && pathname !== '/login') {
    return NextResponse.redirect(LOGIN_URL);
  }

}