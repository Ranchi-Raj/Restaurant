import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Item from "@/modals/item";
// import { ObjectId } from "mongodb";

export async function PATCH(request : Request){
    try{
        await dbConnect();
        const data = await request.json();
        const { id, isAvailable } = data;
        console.log("Id",id)
        console.log("isAvailable",isAvailable)
        const updatedItem = await Item.findByIdAndUpdate({_id : id},
             { $set : {isAvailable : isAvailable} },
              { new: true });

        if (!updatedItem) {
            return NextResponse.json({ message: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Availability toggled successfully", item: updatedItem }, { status: 200 });
    }
    catch(e){
         return NextResponse.json({message : "failed to toggle availability", error : e},{status : 500})
    }
}