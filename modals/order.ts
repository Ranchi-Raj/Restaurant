import mongoose, { Schema, Model } from "mongoose";

export interface Order{
    name: string;
    phone: string;
    items: {
        itemId: mongoose.Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
    status: "Pending" | "In Progress" | "Completed" | "Cancelled";
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema : Schema<Order> = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    items: [{
        itemId: { type: mongoose.Types.ObjectId, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Live", "Completed"], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const OrderModel : Model<Order> = mongoose.models.Order || mongoose.model<Order>("Order", orderSchema);

export default OrderModel;
