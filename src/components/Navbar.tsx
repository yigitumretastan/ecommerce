import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-gray-800">
                    NextStore
                </Link>
                <div className="space-x-4">
                    <Link href="/products" className="text-gray-600 hover:text-gray-900">
                        Products
                    </Link>
                    <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                        Cart
                    </Link>
                    <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                        Admin
                    </Link>
                    <Link href="/login" className="text-gray-600 hover:text-gray-900">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}
