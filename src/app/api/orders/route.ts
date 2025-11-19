import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import mongoose from 'mongoose';

export async function GET() {
    try {
        await dbConnect();

        const session = await getSession();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await Order.find({})
            .populate('userId', 'email')
            .populate('items.productId')
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {
        await dbConnect();

        const session = await getSession();
        if (!session) {
            await mongoSession.abortTransaction();
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items } = body; // items: { productId: string, quantity: number }[]

        if (!items || items.length === 0) {
            await mongoSession.abortTransaction();
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        let total = 0;
        const orderItemsData = [];

        for (const item of items) {
            const product = await Product.findById(item.productId).session(mongoSession);

            if (!product) {
                await mongoSession.abortTransaction();
                throw new Error(`Product ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                await mongoSession.abortTransaction();
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            // Update stock
            product.stock -= item.quantity;
            await product.save({ session: mongoSession });

            total += product.price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // Create order
        const order = await Order.create(
            [{
                userId: session.user.id,
                total,
                items: orderItemsData,
            }],
            { session: mongoSession }
        );

        await mongoSession.commitTransaction();
        return NextResponse.json(order[0]);
    } catch (error: unknown) {
        await mongoSession.abortTransaction();
        console.error('Create order error:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    } finally {
        mongoSession.endSession();
    }
}
