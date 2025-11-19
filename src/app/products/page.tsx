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

async function getProducts(): Promise<Product[]> {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return products.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
        id: product._id.toString(),
        price: product.price.toString()
    }));
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
