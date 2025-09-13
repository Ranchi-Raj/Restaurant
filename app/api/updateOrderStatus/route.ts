import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Item from "@/modals/order";
// import { ObjectId } from "mongodb";

export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();
        const { id, status } = data;
        console.log("Id", id)
        console.log("status", status)
        const updatedItem = await Item.findByIdAndUpdate({ _id: id },
            { $set: { status: status } },
            { new: true });
        
        console.log("Updated Order",updatedItem)
        
        return NextResponse.json({ message: "Status updated successfully", item: updatedItem }, { status: 200 });

    }
    catch(e)
    {
        return NextResponse.json({message : "failed to update status", error : e},{status : 500})
    }
}