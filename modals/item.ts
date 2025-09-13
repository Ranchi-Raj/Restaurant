import mongoose, { Schema, Model} from "mongoose";

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isVegetarian: boolean
  imageUrl: string
  isAvailable: boolean
}

const menuSchema : Schema<MenuItem> = new Schema({
    id : { type : String, required: true , unique: true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    isVegetarian: { type: Boolean, required: true },
    imageUrl: { type: String },
    isAvailable: { type: Boolean, required: true }
});

const MenuItemModel : Model<MenuItem> = mongoose.models.MenuItem || mongoose.model<MenuItem>("MenuItem", menuSchema);

export default MenuItemModel;