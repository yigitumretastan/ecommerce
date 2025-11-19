import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from '../src/lib/db';
import { User } from '../src/models/User';
import { Product } from '../src/models/Product';

async function seed() {
    try {
        await dbConnect();

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create admin user
        const hashedPassword = await bcrypt.hash('adminpassword', 10);
        await User.create({
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'ADMIN',
        });
        console.log('Admin user created');

        // Create sample products
        const products = [
            {
                name: 'High-Performance Laptop',
                description: 'Powerful laptop for professionals',
                price: 1299.99,
                imageUrl: 'https://placehold.co/400x300/png?text=Laptop',
                stock: 10,
            },
            {
                name: 'Wireless Headphones',
                description: 'Premium noise-cancelling headphones',
                price: 299.99,
                imageUrl: 'https://placehold.co/400x300/png?text=Headphones',
                stock: 25,
            },
            {
                name: 'Smart Watch',
                description: 'Feature-rich smartwatch',
                price: 399.99,
                imageUrl: 'https://placehold.co/400x300/png?text=Watch',
                stock: 15,
            },
            {
                name: '4K Monitor',
                description: 'Ultra HD display for work and gaming',
                price: 599.99,
                imageUrl: 'https://placehold.co/400x300/png?text=Monitor',
                stock: 8,
            },
        ];

        for (const product of products) {
            await Product.create(product);
            console.log(`Created product: ${product.name}`);
        }

        console.log('\n🌱 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
