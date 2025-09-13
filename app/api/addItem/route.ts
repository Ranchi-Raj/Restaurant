import { NextResponse} from "next/server";
import dbConnect from "@/lib/mongoose";
import Item from "@/modals/item";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const data = await request.json();
        console.log("Data",data)
       
        const newItem = await Item.create({...data,id : new ObjectId()});
        console.log("Item successfully Added")
        return NextResponse.json({ message: "Item added successfully", item: newItem }, { status: 201 });
        
    } catch (error) {
        console.error("Error adding item:", error);
        return NextResponse.json({ message: "Failed to add item" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const items = await Item.find().sort({ createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
        return NextResponse.json({ message: "Failed to fetch items" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const { id } = await request.json();
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return NextResponse.json({ message: "Item not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting item:", error);
        return NextResponse.json({ message: "Failed to delete item" }, { status: 500 });
    }
}