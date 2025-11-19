import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import AddToCartButton from '@/components/AddToCartButton';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

async function getProduct(id: string) {
    return await prisma.product.findUnique({
        where: { id },
    });
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden relative">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div>
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                <p className="text-2xl font-bold text-blue-600 mb-6">
                    ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-gray-600 mb-8">{product.description}</p>
                <div className="mb-6">
                    <span className="text-sm text-gray-500">
                        Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}
                    </span>
                </div>
                {product.stock > 0 && <AddToCartButton product={product} />}
            </div>
        </div>
    );
}
