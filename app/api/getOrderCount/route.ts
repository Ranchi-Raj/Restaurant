import { NextResponse} from "next/server";
import dbConnect from "@/lib/mongoose";
import Item from "@/modals/order";

export async function GET() {
    try {
        await dbConnect();
        const count = await Item.countDocuments();
        return NextResponse.json(count, { status: 200 });
    } catch (error) {
        console.error("Error fetching item count:", error);
        return NextResponse.json({ message: "Failed to fetch item count" }, { status: 500 });
    }
}