import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getStats() {
    const [productCount, orderCount, totalRevenue] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: {
                total: true,
            },
        }),
    ]);

    return {
        productCount,
        orderCount,
        totalRevenue: totalRevenue._sum.total || 0,
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.productCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orderCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        ${Number(stats.totalRevenue).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}
