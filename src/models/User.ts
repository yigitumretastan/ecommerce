import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'CUSTOMER' },
    },
    { timestamps: true }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
