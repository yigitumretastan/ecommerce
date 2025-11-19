
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create Admin User
    const adminEmail = 'admin@example.com'
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    })

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('adminpassword', 10)
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        })
        console.log('Admin user created')
    }

    // Create Sample Products
    const products = [
        {
            name: 'High-Performance Laptop',
            description: 'A powerful laptop for all your computing needs.',
            price: 1299.99,
            imageUrl: 'https://placehold.co/600x400?text=Laptop',
            stock: 50,
        },
        {
            name: 'Wireless Headphones',
            description: 'Noise-cancelling headphones with superior sound quality.',
            price: 199.99,
            imageUrl: 'https://placehold.co/600x400?text=Headphones',
            stock: 100,
        },
        {
            name: 'Smart Watch',
            description: 'Track your fitness and stay connected.',
            price: 299.99,
            imageUrl: 'https://placehold.co/600x400?text=Smart+Watch',
            stock: 75,
        },
        {
            name: '4K Monitor',
            description: 'Crystal clear display for work and play.',
            price: 399.99,
            imageUrl: 'https://placehold.co/600x400?text=Monitor',
            stock: 30,
        },
    ]

    for (const product of products) {
        const existingProduct = await prisma.product.findFirst({
            where: { name: product.name },
        })

        if (!existingProduct) {
            await prisma.product.create({
                data: product,
            })
            console.log(`Created product: ${product.name} `)
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
