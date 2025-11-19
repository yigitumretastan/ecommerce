import mongoose, { Schema, Model } from 'mongoose';

export interface IProduct {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
