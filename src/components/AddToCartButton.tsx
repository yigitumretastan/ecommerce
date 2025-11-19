'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface Product {
    id: string;
    name: string;
    price: number | string; 
    imageUrl: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
            quantity: 1,
        });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAddToCart}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${isAdded
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
        >
            {isAdded ? 'Added to Cart!' : 'Add to Cart'}
        </button>
    );
}
