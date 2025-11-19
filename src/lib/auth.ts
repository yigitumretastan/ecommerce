import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this';
const key = new TextEncoder().encode(SECRET_KEY);

interface SessionPayload extends JWTPayload {
    user: {
        id: string;
        email: string;
        role: string;
    };
    expires: Date;
}

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload as unknown as JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
}

export async function login() {
    // Verify credentials && get the user
    // ...
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // Mock user for now as this function is not fully implemented here (logic is in api/auth/login)
    const session = await encrypt({ user: { id: '1', email: 'test', role: 'CUSTOMER' }, expires });

    // Save the session in a cookie
    (await cookies()).set({
        name: 'session',
        value: session,
        httpOnly: true,
        expires: expires,
    });
}

export async function logout() {
    // Destroy the session
    (await cookies()).set('session', '', { expires: new Date(0) });
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch {
        return null;
    }
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}
