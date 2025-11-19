import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this';
const key = new TextEncoder().encode(SECRET_KEY);

export interface SessionPayload extends JWTPayload {
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
