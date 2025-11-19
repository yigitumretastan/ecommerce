import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/jwt';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const session = await encrypt({
            user: { id: user._id.toString(), email: user.email, role: user.role },
            expires
        });

        (await cookies()).set('session', session, { expires, httpOnly: true });

        return NextResponse.json({ success: true, user: { email: user.email, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
