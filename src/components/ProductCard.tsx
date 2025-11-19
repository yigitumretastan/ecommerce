import Image from 'next/image';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number | string; // Decimal serialized
    imageUrl: string;
    stock: number;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full bg-gray-200">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                </p>
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">${Number(product.price).toFixed(2)}</span>
                    <Link
                        href={`/products/${product.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}
