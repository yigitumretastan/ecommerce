import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
                </div>
                <nav className="mt-6">
                    <Link
                        href="/admin"
                        className="block px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className="block px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                        Products
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="block px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                        Orders
                    </Link>
                    <Link
                        href="/"
                        className="block px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-t mt-4"
                    >
                        Back to Store
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
