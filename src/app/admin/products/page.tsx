import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

interface Product {
    id: string;
    name: string;
    description: string;
    price: number | string;
    imageUrl: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

async function getProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return products.map(product => ({
        ...product,
        price: product.price.toString()
    }));
}

async function deleteProduct(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/products');
}

export default async function AdminProductsPage() {
    const products = await getProducts();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add New Product
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 relative">
                                            <Image
                                                className="rounded-full object-cover"
                                                src={product.imageUrl}
                                                alt=""
                                                fill
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${Number(product.price).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <form action={deleteProduct} className="inline-block">
                                        <input type="hidden" name="id" value={product.id} />
                                        <button
                                            type="submit"
                                            className="text-red-600 hover:text-red-900 ml-4"
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
