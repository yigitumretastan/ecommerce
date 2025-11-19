import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IOrderItem {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder {
    userId: Types.ObjectId;
    status: string;
    total: number;
    items: IOrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, default: 'PENDING' },
        total: { type: Number, required: true },
        items: [OrderItemSchema],
    },
    { timestamps: true }
);

export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
