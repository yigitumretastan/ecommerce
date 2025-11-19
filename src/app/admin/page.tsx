import dbConnect from '@/lib/db';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { User } from '@/models/User';

async function getStats() {
    await dbConnect();

    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    return { totalProducts, totalOrders, totalUsers };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">Total Products</h2>
                    <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">Total Orders</h2>
                    <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">Total Users</h2>
                    <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
            </div>
        </div>
    );
}
