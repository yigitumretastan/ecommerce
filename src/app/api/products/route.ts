import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';

export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const session = await getSession();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, price, imageUrl, stock } = body;

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            imageUrl,
            stock: parseInt(stock),
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
