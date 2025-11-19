'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeFromCart, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <Link href="/products" className="text-blue-600 hover:underline">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <li key={item.productId} className="p-6 flex items-center">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover object-center"
                                />
                            </div>
                            <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <Link href={`/products/${item.productId}`}>{item.name}</Link>
                                        </h3>
                                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex-1 flex items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty {item.quantity}</p>
                                    <div className="flex">
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.productId)}
                                            className="font-medium text-red-600 hover:text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                        <p>Subtotal</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500 mb-6">
                        Shipping and taxes calculated at checkout.
                    </p>
                    <Link
                        href="/checkout"
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
