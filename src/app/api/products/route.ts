import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const products = await prisma.product.findMany();
        return NextResponse.json(products);
    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, price, imageUrl, stock } = body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
                stock: parseInt(stock),
            },
        });

        return NextResponse.json(product);
    } catch {
        console.error('Create product error:');
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
