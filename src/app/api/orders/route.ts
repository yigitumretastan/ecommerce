import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: { email: true },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(orders);
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
        // For now, let's allow guest checkout or require login? 
        // The plan said "Authentication (Admin/User)", so let's assume we need a user.
        // But wait, I didn't implement customer signup. 
        // For simplicity, I'll allow anyone to create an order if I can't easily get a user ID, 
        // BUT the schema requires userId.
        // So I MUST have a user.
        // I'll assume the user is logged in. If not, I should probably implement signup or guest checkout.
        // Given the constraints, I'll require login.

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { items } = body; // items: { productId: string, quantity: number }[]

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        // Start transaction
        const order = await prisma.$transaction(async (tx) => {
            let total = 0;
            const orderItemsData = [];

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });

                if (!product) {
                    throw new Error(`Product ${item.productId} not found`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }

                // Update stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: product.stock - item.quantity },
                });

                total += Number(product.price) * item.quantity;
                orderItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price,
                });
            }

            // Create order
            return await tx.order.create({
                data: {
                    userId: session.user.id,
                    total,
                    items: {
                        create: orderItemsData,
                    },
                },
                include: {
                    items: true,
                },
            });
        });

        return NextResponse.json(order);
    } catch (error: unknown) {
        console.error('Create order error:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
