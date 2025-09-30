import { NextResponse} from "next/server";
import dbConnect from "@/lib/mongoose";
import Item from "@/modals/order";
// import { ObjectId } from "mongodb";
import { pusherServer } from "@/lib/pusher";

// POST /api/orderItem - Add a new item
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const newItem = await Item.create(data);
        await pusherServer.trigger("my-channel", "my-event", {
            message: "new order placed",
        });
        return NextResponse.json({ message: "Item added successfully", item: newItem }, { status: 201 });
        
    } catch (error) {
        console.error("Error adding item:", error);
        return NextResponse.json({ message: "Failed to add item" }, { status: 500 });
    }
}

// GET /api/orderItem - Get all items
export async function GET(req: Request) {
    try {
         const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "0", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        await dbConnect();
        const items = await Item.find()
        .sort({ createdAt: -1 })
        .skip((page -1 ) * limit)
        .limit(limit);
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ message: "Failed to fetch items" }, { status: 500 });
    }
}

