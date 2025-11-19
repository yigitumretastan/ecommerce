import { PrismaClient } from '@prisma/client';
import ProductCard from '@/components/ProductCard';

const prisma = new PrismaClient();

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

async function getFeaturedProducts(): Promise<Product[]> {
  // In a real app, we might have a 'featured' flag
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return products.map((product: any) => ({
    ...product,
    price: product.price.toString()
  }));
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gray-50 rounded-xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to NextStore</h1>
        <p className="text-xl text-gray-600">
          Discover the best products at amazing prices.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
