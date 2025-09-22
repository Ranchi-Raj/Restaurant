"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "./components/navbar"
import Footer from "./components/footer"
import Hero from "./components/hero"
import axios from "axios"
import {Toaster} from 'react-hot-toast'
import Loader from "./components/loader"
import { ArrowBigUp } from "lucide-react"
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

// Cart item type
interface CartItem {
  item: MenuItem
  quantity: number
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<MenuItem[]>()
  const [loading, setLoading] = useState(true)
  // Get unique categories
  const categories = menuItems ? Array.from(new Set(menuItems!.map((item) => item.category))) : []

  useEffect(() => {
    // Fetch menu items from API
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get<MenuItem[]>("/api/addItem")
        console.log("Response", response.data)
        const toAdd: MenuItem[] = []

        response.data.map((item) => {
          const add = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            isVegetarian: item.isVegetarian,
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable,
          }
          toAdd.push(add)
        })

        setMenuItems(toAdd)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching menu items:", error)
      }
    }
    fetchMenuItems()
  }, [])

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.item.id === item.id)
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [...prevCart, { item, quantity: 1 }]
      }
    })
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }))
    console.log("Add to cart clicked")
  }

  // Update quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    console.log("Update quantity clicked", itemId)
    if (newQuantity < 1) return

    setQuantities((prev) => ({ ...prev, [itemId]: newQuantity }))

    setCart((prevCart) => {
      return prevCart.map((cartItem) =>
        cartItem.item.id === itemId ? { ...cartItem, quantity: newQuantity } : cartItem,
      )
    })
  }

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.item.id !== itemId))
    setQuantities((prev) => {
      const newQuantities = { ...prev }
      delete newQuantities[itemId]
      return newQuantities
    })
  }

  // Format price
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`
  }

  const emptyCart = () => {
    setCart([])
    setQuantities({})
  }

  if(loading){
    return <Loader/>
  }
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <Toaster/>
      <Navbar cart={cart} setCart={setCart} removeFromCart={removeFromCart} emptyCart={emptyCart} />

      {/* Hero Section */}
      <Hero />

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-16"  id="menu">
        <a className="text-4xl font-serif font-bold text-center mb-3 text-stone-800">Our Menu</a>
        <p className="text-center text-stone-600 mb-12 text-lg">Delicious food and beverages crafted with care</p>

        {/* Menu Items Accordion */}
        <div className="max-w-5xl mx-auto">
          <Accordion type="multiple" className="w-full space-y-4">
            {categories.map((category) => (
              <AccordionItem key={category} value={category} className="border-0 shadow-sm">
                <AccordionTrigger className="px-8 py-4 text-xl font-serif font-semibold hover:no-underline bg-gradient-to-r from-amber-100 to-orange-50 hover:from-amber-200 hover:to-orange-100 rounded-xl border border-stone-200 shadow-sm transition-all duration-200">
                  <div className="flex items-center">
                    <span className="mr-4 text-2xl">
                      {category === "Breakfast" && "☀️"}
                      {category === "Lunch" && "🥪"}
                      {category === "Beverages" && "☕"}
                      {category === "Desserts" && "🍰"}
                    </span>
                    <span className="text-stone-800">{category}</span>
                    <span className="ml-3 text-sm text-stone-600 font-sans bg-white px-3 py-1 rounded-full">
                      {menuItems!.filter((item) => item.category === category).length} items
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <div className="space-y-6 mt-6">
                    {menuItems!
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden border-stone-200 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4 h-48 md:h-auto relative">
                              <Image
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover rounded-xl mx-3"
                              />
                              {/* Veg and Non-veg */}
                              <div className="absolute top-3 left-3">
                                {item.isVegetarian ? (
                                  <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                                    🟢 Veg
                                  </span>
                                ) : (
                                  <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                                    🔴 Non-Veg
                                  </span>
                                )}
                              </div>

                              {/* Availability */}
                              {!item.isAvailable && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                                  <span className="text-white font-semibold text-lg">Out of Stock</span>
                                </div>
                              )}
                            </div>

                            <div className="p-6 flex-grow">
                              <CardHeader className="p-0 pb-3">
                                <CardTitle className="text-stone-800 text-xl font-serif">{item.name}</CardTitle>
                                <CardDescription className="text-stone-600 text-base leading-relaxed">
                                  {item.description}
                                </CardDescription>
                                <p className="text-amber-700 font-bold text-lg mt-3">{formatPrice(item.price)}</p>
                              </CardHeader>

                              <CardFooter className="p-0 mt-6">
                                {quantities[item.id] > 0 ? (
                                  <div className="flex items-center space-x-4">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => {
                                        updateQuantity(item.id, quantities[item.id] - 1)
                                        console.log("Update quantity clicked 22 ", item.id)
                                      }}
                                      className="h-9 w-9 rounded-full border-stone-300 hover:bg-stone-100 text-stone-700"
                                    >
                                      -
                                    </Button>
                                    <span className="font-semibold text-stone-800 min-w-[2rem] text-center">
                                      {quantities[item.id]}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => updateQuantity(item.id, quantities[item.id] + 1)}
                                      className="h-9 w-9 rounded-full border-stone-300 hover:bg-stone-100 text-stone-700"
                                    >
                                      +
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      onClick={() => removeFromCart(item.id)}
                                      className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm h-9 px-4"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => addToCart(item)}
                                    disabled={!item.isAvailable}
                                    className={`${item.isAvailable ? "bg-amber-700 hover:bg-amber-800 text-white shadow-sm" : "bg-stone-300 text-stone-500"} px-6 py-2 font-medium transition-colors duration-200`}
                                  >
                                    {item.isAvailable ? "Add to Order" : "Out of Stock"}
                                  </Button>
                                )}
                              </CardFooter>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
            {
        cart.length > 0 && (
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
            <Button
            className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition"
              onClick={() => {
                const cartSection = document.getElementById("cart-section")
                if (cartSection) {
                  cartSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
              ><ArrowBigUp/> Go to Cart</Button>
              </div>
        )
            }
      {/* Footer */}
      <Footer />
    </div>
  )
}
