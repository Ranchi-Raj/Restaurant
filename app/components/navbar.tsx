"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"
// import { Separator } from "@/components/ui/separator"
import mongoose from "mongoose"
import toast from "react-hot-toast"
import { Loader, Loader2 } from "lucide-react"
import Razorpay from "./razorpay"
import CentralModal from "./bookedModal"

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

interface Order{
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

interface Props {
    cart: CartItem[]
    setCart?: React.Dispatch<React.SetStateAction<CartItem[]>>
    removeFromCart: (itemId: string) => void
    emptyCart: () => void
    // calculateTotal: () => number
    // formatPrice: (price: number) => string
}
interface CartItem {
  item: MenuItem
  quantity: number
}
  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`
  }

  
  // Calculate total
  export default function Navbar(
    { cart ,removeFromCart, emptyCart }: Props
    )
    
    {
      
    //   const [cart, setCart] = useState<CartItem[]>([])
      const [isCartOpen, setIsCartOpen] = useState(false)
      const [name, setName] = useState("")
      const [phone, setPhone] = useState("")
      const [ordering, setOrdering] = useState(false)
      const [email, setEmail] = useState("")
      const [isOpen, setIsOpen] = useState(false)
      const [orderId, setOrderId] = useState("")
      const calculateTotal = () => {
        return cart.reduce((total, cartItem) => {
          return total + (cartItem.item.price * cartItem.quantity)
        }, 0)
      }

  const handleOrder = async ()=> {
    // setOrdering(true)

    const toSend : Order = {
    name,
    phone,
    items: cart.map(cartItem => ({
      itemId: new mongoose.Types.ObjectId(cartItem.item.id),
      name: cartItem.item.name,
      quantity: cartItem.quantity,
      price: cartItem.item.price
    })),
    total: calculateTotal(),
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date()
    }

    const data = await axios.post('/api/orderItem', toSend)
    console.log("Order placed:", data) // data.data.item._id hmko chahiye
    setOrderId(data.data.item._id)
    // Show modal
    setIsOpen(true)
    // Clear cart and form
    setIsCartOpen(false);
    setName("");
    setPhone("");
    setEmail("");
    emptyCart();
    toast.success("Order placed successfully!")
    setOrdering(false);
  }
    

  return (
    <div>
      {
        isOpen && <CentralModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Order Confirmation"
        content={"localhost:3000/order/" + orderId}
      />
      }
      <nav id="cart-section" className=" text-black p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center">
          <h1 className="text-2xl font-serif font-bold">Kanha Restaurant</h1>
        </div>
       <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" className="relative text-black border-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            
            {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
            )}
            </Button>
            </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-gradient-to-b from-amber-50 to-amber-100">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-amber-900 text-center">🛒 Your Cart</DialogTitle>
                    <DialogDescription className="text-amber-700 text-center">
                    Review your delicious picks before checkout
                    </DialogDescription>
                </DialogHeader>

                 
                <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Label htmlFor="name m-2">Name</Label>
                    <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="flex-1">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="number" placeholder="Enter your phone number" value={phone} onChange={(e) => setPhone(e.target.value) } 
                    maxLength={10} className={phone.length !== 10 && phone.length !== 0 ? "border-red-500" : ""}/>
                </div>
                <div className="flex-1">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value) } />
                </div>
                </div>

                <div className="mt-6">
                    {cart.length === 0 ? (
                    <p className="text-center text-amber-700 py-8 italic">Your cart is empty ☕</p>
                    ) : (
                    <ScrollArea className="h-[50vh] px-4 relative">
                        <div className="space-y-5 mb-28">
                        {cart.map(cartItem => (
                            <div
                            key={cartItem.item.id}
                            className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition"
                            >
                            {/* Item Image */}
                            <div className="flex items-center space-x-4">
                                <Image
                                width={64}
                                height={64}
                                src={cartItem.item.imageUrl}
                                alt={cartItem.item.name}
                                className="w-16 h-16 rounded-md object-cover shadow-sm"
                                />
                                <div>
                                <h4 className="font-semibold text-amber-900">{cartItem.item.name}</h4>
                                <p className="text-sm text-amber-700">
                                    {formatPrice(cartItem.item.price)} × {cartItem.quantity}
                                </p>
                                </div>
                            </div>

                            {/* Price + Remove */}
                            <div className="flex items-center space-x-3">
                                <p className="font-bold text-amber-800">
                                {formatPrice(cartItem.item.price * cartItem.quantity)}
                                </p>
                                <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(cartItem.item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                </Button>
                            </div>
                            </div>
                        ))}
                        </div>
                        {/* <Separator /> */}
                       

                        {/* Sticky Footer */}
                        <div className="absolute bottom-0 left-0 right-0 bg-amber-100 border-t border-amber-200 p-4 shadow-md">
                        <div className="flex justify-between items-center text-lg font-bold text-amber-900 mb-4">
                            <span>Total:</span>
                            <span>{formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="space-y-2">
                        
                        </div>
                        <Button
                        disabled={ordering || (phone.length !== 10 || name.length <= 2)}
                        // onClick={handleOrder} 
                        className="w-full bg-amber-700 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-amber-700/40 transition">
                            { ordering ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Razorpay setOrdering = {setOrdering} amount={calculateTotal()} name={name} phone={phone} handleOrder={handleOrder}
                              disable={ ordering || (phone.length !== 10 || name.length <= 2)} /> }
                        </Button>
                        </div>
                    </ScrollArea>
                    )}
                    
                </div>
                </DialogContent>

            </Dialog>
        </nav>
    </div>
  )
}
