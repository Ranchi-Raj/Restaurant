import { NextResponse} from "next/server";
import dbConnect from "@/lib/mongoose";
import Item from "@/modals/order";

export async function GET(request: Request) {
    try{
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const duration = parseInt(searchParams.get("duration") || "0", 10);
        // const { duration } = data; // duration in days
        if (!duration || isNaN(duration) || duration <= 0) {
            return NextResponse.json({ message: "Invalid duration" }, { status: 400 });
        }

        const OrdersDaysAgo = new Date();
        OrdersDaysAgo.setDate(OrdersDaysAgo.getDate() - duration);

        const orders = await Item.find({ createdAt: { $gte: OrdersDaysAgo } }).sort({ createdAt: -1 }).exec();

        return NextResponse.json(orders, { status: 200 });
    }
    catch(e){
        return NextResponse.json({message : "failed to fetch orders", error : e},{status : 500})
    }
}