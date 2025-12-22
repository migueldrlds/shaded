import {
  exchangeCodeForToken
} from 'lib/shopify/customer-account-api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');


    if (error) {

      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, req.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/login?error=missing_parameters', req.url)
      );
    }


    const cookieStore = await cookies();
    const storedState = cookieStore.get('oauth_state')?.value;

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL('/login?error=invalid_state', req.url)
      );
    }


    const codeVerifier = cookieStore.get('oauth_code_verifier')?.value;

    if (!codeVerifier) {
      return NextResponse.redirect(
        new URL('/login?error=missing_verifier', req.url)
      );
    }


    const redirectUri = `${req.nextUrl.origin}/api/auth/callback`;
    const tokenResponse = await exchangeCodeForToken({
      code,
      redirectUri,
      codeVerifier
    });


    cookieStore.set('customerAccessToken', tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.expires_in || 60 * 60 * 24 * 30
    });


    cookieStore.delete('oauth_code_verifier');
    cookieStore.delete('oauth_state');
    cookieStore.delete('oauth_nonce');
    cookieStore.delete('oauth_email');


    return NextResponse.redirect(new URL('/?login=success', req.url));
  } catch (error: any) {

    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url)
    );
  }
}

