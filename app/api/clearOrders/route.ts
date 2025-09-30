import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Item from "@/modals/order";

export async function POST(request: Request) {
    try{
        await dbConnect();
        const data = await request.json();
        const { duration } = data; // duration in days
        if (!duration || isNaN(duration) || duration <= 0) {
            return NextResponse.json({ message: "Invalid duration" }, { status: 400 });
        }
        const OrdersDaysAgo = new Date();
        OrdersDaysAgo.setDate(OrdersDaysAgo.getDate() - duration);
        await Item.deleteMany({ createdAt: { $lte: OrdersDaysAgo } }).exec();
        
        return NextResponse.json({ message: "Old orders cleared successfully" }, { status: 200 });
    }
    catch(e){
        return NextResponse.json({message : "failed to clear orders", error : e},{status : 500})
    }
}