import { NextResponse} from "next/server";
import dbConnect from "@/lib/mongoose";
import Item from "@/modals/order";

export async function GET(request: Request) {
    try{
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get("id");
        if (!orderId) {
            return NextResponse.json({ message: "Order ID is required" }, { status: 400 });
        }
        const order = await Item.findById(orderId);
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        return NextResponse.json(order, { status: 200 });
    }
    catch(e){
        return NextResponse.json({message : "failed to fetch order", error : e},{status : 500})
    }
}