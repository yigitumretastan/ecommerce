import ProductCard from '@/components/ProductCard';
import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';

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
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(6).lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return products.map((product: any) => ({
    ...product,
    _id: product._id.toString(),
    id: product._id.toString(),
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
