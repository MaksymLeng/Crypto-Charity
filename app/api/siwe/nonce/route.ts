import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {generateNonce} from "siwe";

export async function GET() {
    const nonce = generateNonce();
    
    (await cookies()).set('siwe_nonce', nonce, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
    });
    return NextResponse.json({ nonce });
}
