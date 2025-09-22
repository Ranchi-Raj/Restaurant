"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription,CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import {toast, Toaster} from "react-hot-toast"
import Loader from "../components/loaderAdmin"
 import Pusher from "pusher-js";
import PaginationComp from "../components/pagination"
import { Loader2 } from "lucide-react"
import { format } from "path"

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
interface MenuItemAxios {
  _id: string
  name: string
  description: string
  price: number
  category: string
  isVegetarian: boolean
  imageUrl: string
  isAvailable: boolean
}

interface OrderedItem{
  itemId : string
  name : string
  quantity : number
  price : number
}

interface Order {
  id: string
  customerName: string
  items: OrderedItem[]
  total: number
  status: "Pending" | "Live" | "Completed"
  createdAt: string
  phone : string
}
interface OrderAxios {
  _id: string
  name: string
  items: OrderedItem[]
  total: number
  status: "Pending" | "Live" | "Completed"
  createdAt: string
  phone : string
}

function timeFormat(dateStr: string): string {
  const date = new Date(dateStr);

  // add 5 hours 30 minutes offset (19800000 ms)
  const offsetDate = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);

  const day = String(offsetDate.getUTCDate()).padStart(2, "0");
  const month = String(offsetDate.getUTCMonth() + 1).padStart(2, "0");

  const hours = String(offsetDate.getUTCHours()).padStart(2, "0");
  const minutes = String(offsetDate.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month} --  ${hours}:${minutes}`;
}

export default function AdminPage() {
  const offset = 25; // Adjust the offset value as needed
  const [menuItems, setMenuItems] = useState<MenuItem[]>()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState("menu")
  const [orderFilter, setOrderFilter] = useState("all")
  const [newItem, setNewItem] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    isVegetarian: true,
    imageUrl: "",
    isAvailable: false
  })
  const [photoUpload, setPhotoUpload] = useState(false)
  const [itemisAdded, setItemisAdded] = useState(false)
  const[file,setFile] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [refresh,setRefresh] = useState(0)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  // To load all the menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('/api/addItem')
        console.log("Response",response.data)
        const toAdd : MenuItem[] = []

        response.data.map((item: MenuItemAxios) => {
          const add = {
            id : item._id,
            name : item.name,
            description : item.description,
            price : item.price,
            category : item.category,
            isVegetarian : item.isVegetarian,
            imageUrl : item.imageUrl,
            isAvailable : item.isAvailable
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
    
  },[refresh])

  // To load all order and also refresh on new order and pagination
  useEffect(() => {
    const fetchOrders = async () => {
      try{
        const length = await axios.get('/api/getOrderCount')
        setTotalPages(Math.ceil(length.data / offset))
        const data = await axios.get(`/api/orderItem?page=${page}&limit=${offset}`)
        console.log("Orders data:", data.data)
        const toSet : Order[] = []
        data.data.map((order: OrderAxios) => {
          const toAdd : Order = {
            id: order._id,
            customerName: order.name,
            items: order.items,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
            phone: order.phone
          }
          toSet.push(toAdd)
        })
        setOrders(toSet)
      }
      catch(e){
        console.error("Error fetching orders:", e)
      }
    }
    fetchOrders()
  }, [page])
 
  // Pusher for real-time updates
 useEffect(() => {
    // Enable pusher logging for debugging (remove in production)
    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    // interface Data {
    //   message : string
    // }
    const channel = pusher.subscribe("my-channel");
    channel.bind("my-event", function () {
      toast.success("New order placed!")
      speak()
      setRefresh((refresh + 1)%2)
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);


  // To add a new menu item --> working
  const addMenuItem = async () => {
    try{
      setItemisAdded(true)
      const data = await axios.post('/api/addItem', { ...newItem, imageUrl : file })
      setMenuItems([...menuItems!, {...data.data.item, id: data.data.item._id}])
      console.log("Data",data.data.item)
      console.log("Adding new item:", newItem)
      toast.success("Item added successfully!")  
    }
    catch(e){
      console.error("Error adding item:", e)
      toast.error("Failed to add item")
    }
    finally{
      setItemisAdded(false)
    }
  }

  const handleUpload = async (e : React.FormEvent, file : File | null) => {
  e.preventDefault()
  setPhotoUpload(true)
  if (!file) return

  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post('/api/uploadImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log("Upload response:", response.data)
    // Handle the response as needed
    console.log("Image url",response.data.image)
    setFile(response.data.image)
    toast.success("Image uploaded successfully!")

  } catch (error) {
    console.error("Error uploading file:", error)
  }
  finally{
    setPhotoUpload(false)
  }
}

  const deleteMenuItem = async (id : string) => {
    // To be implemented
    await axios.delete('/api/addItem', { data: { id } })
    setMenuItems(menuItems!.filter(item => item.id !== id))
    console.log("Deleting item:", id)
  }

  const toggleAvailability = async (id : string) => {
    // To be implemented --> working
    setMenuItems(menuItems!.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    await axios.patch('/api/toggleAvail', { id, isAvailable: !menuItems!.find(item => item.id === id)?.isAvailable })
    console.log("Toggling availability for item:", id)
  }

  const filteredOrders = orderFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === orderFilter)

  
    const handleOrderClick = async (orderId: string) => {
      const order = orders.find(o => o.id === orderId)
      if (!order) return
      let updatedOrder = order
      if(order.status === "Pending") {
        // Change status to Live
         updatedOrder = { ...order, status: "Live" }
      }
      else if(order.status === "Live") {
        // Change status to Completed
         updatedOrder = { ...order, status: "Completed" }
      }
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o))
      await axios.patch('/api/updateOrderStatus', { id: orderId, status: updatedOrder.status })
      console.log("Order updated:", updatedOrder)
    }

    const speak = () => {
    if (typeof window !== "undefined") {
      const utterance = new SpeechSynthesisUtterance("New order placed");
      utterance.lang = "en-US"; // you can change the language
      window.speechSynthesis.speak(utterance);
    }
  };

    if(loading){
      return <Loader/>
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-slate-100">
      {/* Navbar */}
      <Toaster/>
      <nav className="bg-slate-800/70 backdrop-blur-md border-b border-slate-700/50 px-6 py-4 shadow-xl">
        <div className="flex justify-center items-center">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Cafe Delight Admin</h1>
          {/* <Button variant="outline">Logout</Button> */}
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 p-1 rounded-lg mb-6">
            <TabsTrigger 
              value="menu" 
              className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white rounded-md transition-all mx-auto"
            >
              Manage Menu
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white rounded-md transition-all mx-auto"
            >
              Manage Orders
            </TabsTrigger>
          </TabsList>

          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-300">Menu Items</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your menu items, availability, and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <AddItemDialog onAddItem={addMenuItem} newItem={newItem} setNewItem={setNewItem} handleUpload={handleUpload} photoUpload={photoUpload} itemisAdded={itemisAdded}/>
                </div>

                <div className="rounded-lg overflow-hidden border border-slate-700/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-slate-700 hover:bg-slate-800/50">
                        <TableHead className="text-blue-300">Name</TableHead>
                        <TableHead className="text-blue-300">Category</TableHead>
                        <TableHead className="text-blue-300">Price</TableHead>
                        <TableHead className="text-blue-300">Type</TableHead>
                        <TableHead className="text-blue-300">Status</TableHead>
                        <TableHead className="text-blue-300">Availability</TableHead>
                        <TableHead className="text-blue-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menuItems && menuItems!.map((item) => (
                        <TableRow key={item.id} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors">
                          <TableCell className="font-medium text-gray-300">{item.name}</TableCell>
                          <TableCell className=" text-gray-300">{item.category}</TableCell>
                          <TableCell className=" text-gray-400">₹{item.price}</TableCell>
                          <TableCell>
                            <Badge variant={item.isVegetarian ? "default" : "secondary"} 
                              className={item.isVegetarian ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}>
                              {item.isVegetarian ? "Veg" : "Non-Veg"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.isAvailable ? "default" : "destructive"}
                              className={item.isAvailable ? "bg-blue-500/20 text-blue-300" : "bg-slate-500/20 text-slate-300"}>
                              {item.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex justify-start">
                            <Switch
                              checked={item.isAvailable}
                              onCheckedChange={() => toggleAvailability(item.id)}
                              className="data-[state=checked]:bg-blue-500"
                            />
                          </TableCell>
                          <TableCell className="">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteMenuItem(item.id)}
                              className="bg-rose-600/80 hover:bg-rose-500"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order Management Tab */}
          <TabsContent value="orders">
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-300">Order Management</CardTitle>
                <CardDescription className="text-slate-400">
                  View and manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button 
                    variant={orderFilter === "all" ? "default" : "outline"}
                    onClick={() => setOrderFilter("all")}
                    className={orderFilter === "all" ? "bg-blue-600 hover:bg-blue-500" : "bg-transparent text-slate-300 border-slate-600 hover:bg-slate-700/50"}
                  >
                    All Orders
                  </Button>
                  <Button 
                    variant={orderFilter === "Pending" ? "default" : "outline"}
                    onClick={() => setOrderFilter("Pending")}
                    className={orderFilter === "Pending" ? "bg-amber-600 hover:bg-amber-500" : "bg-transparent text-slate-300 border-slate-600 hover:bg-slate-700/50"}
                  >
                    Requests
                  </Button>
                  <Button 
                    variant={orderFilter === "Live" ? "default" : "outline"}
                    onClick={() => setOrderFilter("Live")}
                    className={orderFilter === "Live" ? "bg-blue-600 hover:bg-blue-500" : "bg-transparent text-slate-300 border-slate-600 hover:bg-slate-700/50"}
                  >
                    Live
                  </Button>
                  <Button 
                    variant={orderFilter === "Completed" ? "default" : "outline"}
                    onClick={() => setOrderFilter("Completed")}
                    className={orderFilter === "Completed" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-transparent text-slate-300 border-slate-600 hover:bg-slate-700/50"}
                  >
                    Completed
                  </Button>
                </div>

                <div className="rounded-lg overflow-hidden border border-slate-700/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-slate-700 hover:bg-slate-800/50">
                        <TableHead className="text-blue-300">Order ID</TableHead>
                        <TableHead className="text-blue-300">Date&Time</TableHead>
                        <TableHead className="text-blue-300">Customer</TableHead>
                        <TableHead className="text-blue-300">Items</TableHead>
                        <TableHead className="text-blue-300">Total</TableHead>
                        <TableHead className="text-blue-300">Status</TableHead>
                        <TableHead className="text-blue-300">Phone No.</TableHead>
                        <TableHead className="text-blue-300 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>

                      {filteredOrders.length === 0 ?  <TableRow><TableCell colSpan={7} className="text-center text-slate-300">No orders found</TableCell></TableRow> :   filteredOrders.map((order) => (
                        <TableRow key={order.id} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors">
                          <TableCell className="font-medium text-gray-300">{order.id.slice(-6)}</TableCell>
                          <TableCell className="text-gray-300">{timeFormat(order.createdAt)}</TableCell>
                          <TableCell className="text-gray-300">{order.customerName}</TableCell>
                          <TableCell className="text-gray-300">
                            <div className="max-w-xs truncate">
                              {order.items.map((item, index) => (
                                <span key={item.itemId}>
                                  {item.name} (x{item.quantity}){index < order.items.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">₹{order.total}</TableCell>
                          <TableCell>
                            <Badge className={
                              order.status === "Completed" ? "bg-emerald-500/20 text-emerald-300" :
                              order.status === "Live" ? "bg-blue-500/20 text-blue-300" : "bg-amber-500/20 text-amber-300"
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">{order.phone}</TableCell>
                          <TableCell className="text-center">
                            {order.status === "Completed" ? (
                              <Badge className="bg-emerald-500/20 text-emerald-300">Completed</Badge>
                            ) : 
                            <Button 
                              onClick={() => handleOrderClick(order.id)}
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
                            >
                              Next
                            </Button>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            <PaginationComp
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </TabsContent>
        </Tabs>
         
      </div>
    </div>
  )
}
interface AddItemDialogProps {
  onAddItem: () => void
  newItem: MenuItem
  setNewItem: React.Dispatch<React.SetStateAction<MenuItem>>
  handleUpload: (e: React.FormEvent, file: File | null) => void
  photoUpload: boolean
  itemisAdded: boolean
}
// Add Item Dialog Component
function AddItemDialog({ onAddItem, newItem, setNewItem, handleUpload, photoUpload, itemisAdded }: AddItemDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
    // Form processing logic to be implemented
    onAddItem()
    setOpen(false)
  }

  const [file,setFile] = useState<File | null>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-blue-300">Add Menu Item</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new item to your menu. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-slate-300">
                Name
              </Label>
              <Input 
                id="name" 
                className="col-span-3 bg-slate-700 border-slate-600 text-white" 
                value={newItem.name} 
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-slate-300">
                Description
              </Label>
              <Input 
                id="description" 
                className="col-span-3 bg-slate-700 border-slate-600 text-white" 
                value={newItem.description} 
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right text-slate-300">
                Price (₹)
              </Label>
              <Input 
                id="price" 
                type="number" 
                className="col-span-3 bg-slate-700 border-slate-600 text-white" 
                value={newItem.price} 
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-slate-300">
                Category
              </Label>
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger className="col-span-3 bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Desserts">Desserts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vegetarian" className="text-right text-slate-300">
                Vegetarian
              </Label>
              <Switch 
                id="vegetarian" 
                className="col-span-3 data-[state=checked]:bg-blue-500" 
                checked={newItem.isVegetarian} 
                onCheckedChange={(value) => setNewItem({ ...newItem, isVegetarian: value })} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="available" className="text-right text-slate-300">
                Available
              </Label>
              <Switch 
                id="available" 
                className="col-span-3 data-[state=checked]:bg-blue-500" 
                checked={newItem.isAvailable} 
                onCheckedChange={(value) => setNewItem({ ...newItem, isAvailable: value })} 
              />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="image" className="text-right text-slate-300">
                Image URL
              </Label>
              <Input 
                id="image" 
                type="file"
                accept="image/*"
                placeholder="Enter image URL" 
                className="col-span-3 bg-slate-700 border-slate-600 text-white" 
                // value={file ? file.name : null} 
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            <Button onClick={(e) => handleUpload(e,file)} disabled={photoUpload}>
              {photoUpload ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Upload"}
            </Button>
            </div>
          </div>
          <DialogFooter className="flex justify-center w-full">
            <Button 
              type="submit"
              disabled={itemisAdded}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
            >
              {itemisAdded ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}