import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';

const prisma = new PrismaClient();

async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">All Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
