"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Footer from "../../components/footer"
import { CheckCircle2, Clock, Utensils, Truck } from "lucide-react"
import { useParams } from "next/navigation"
interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  status: "Ordered" | "Pending" | "Live" | "Completed"
  items: OrderItem[]
  total: number
}

const orderStatusSteps = [
  { key: "Ordered", label: "Ordered", icon: Clock },
  { key: "Pending", label: "Pending", icon: CheckCircle2 },
  { key: "Live", label: "Live", icon: Utensils },
  { key: "Completed", label: "Completed", icon: Truck },
]

export default function OrderTracking() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const params = useParams();
  const { orderId } = params;
//   const mockOrder: Order = {
//       id: "ORD-12345",
//       status: "preparing",
//       items: [
//         { id: "1", name: "Butter Chicken", quantity: 2, price: 450 },
//         { id: "2", name: "Garlic Naan", quantity: 4, price: 120 },
//       ],
//       total: 1140,
     
//     }
  useEffect(() => {
    const fetchOrder = async () => {
        const data = await fetch(`/api/getOrderById?id=${orderId}`);
        const orderData = await data.json();
        console.log("Fetched order data:", orderData);
        console.log("Fetched order ID:", orderId);
        setCurrentOrder({
            id : orderData._id,
            status : orderData.status,
            items : orderData.items,
            total : orderData.total
        })
    }
    fetchOrder();
  }, [])

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  const getStatusIndex = (statusKey: string) => {
    return orderStatusSteps.findIndex(step => step.key === statusKey)
  }

  const currentStatusIndex = getStatusIndex(currentOrder.status)

  return (
    <div className="min-h-screen bg-stone-50">
      <nav id="cart-section" className=" text-black p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center">
          <h1 className="text-2xl font-serif font-bold">Kanha Restaurant</h1>
        </div>
        </nav>
      <div className="container mx-auto px-4 py-6">

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-stone-800 mb-2">Order Tracking</h1>
            <p className="text-stone-600">Order #{currentOrder.id}</p>
          </div>

          {/* Status Bubbles */}
          <Card className="shadow-lg border-stone-200 mb-6">
            <CardHeader>
              <CardTitle className="text-center text-stone-800">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                {orderStatusSteps.map((step, index) => {
                  const StepIcon = step.icon
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-amber-700 text-white' 
                          : 'bg-stone-200 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-amber-200' : ''}`}>
                        <StepIcon className="h-6 w-6" />
                      </div>
                      <p className={`text-sm mt-2 ${isCompleted ? 'text-stone-800 font-medium' : 'text-stone-500'}`}>
                        {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>
              
              <div className="flex justify-between px-2">
                {orderStatusSteps.map((step, index) => (
                  <div key={step.key} className={`h-1 flex-1 mx-1 ${
                    index < currentStatusIndex ? 'bg-amber-700' : 'bg-stone-200'
                  } ${index === 0 ? 'rounded-l-full' : ''} ${
                    index === orderStatusSteps.length - 1 ? 'rounded-r-full' : ''
                  }`} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-lg border-stone-200">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-50 border-b border-stone-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-stone-800">Order Summary</CardTitle>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  {orderStatusSteps.find(step => step.key === currentOrder.status)?.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 mb-6">
                {currentOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-stone-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-amber-700 font-medium">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-stone-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-stone-800">Total</span>
                  <span className="text-amber-700">₹{currentOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}