import React, { useEffect } from "react";
import axios from "axios";
// import { NextResponse } from "next/server";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function Razorpay({amount, name, phone, handleOrder, disable, setOrdering} : {amount: number | undefined, name: string | undefined, phone: string | undefined, handleOrder: () => void, disable: boolean, setOrdering: React.Dispatch<React.SetStateAction<boolean>>}) {

    useEffect(() => {
    // Dynamically load the Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup script when component unmounts
    };
  }, []);


  const handlePayment = async () => {
    try {
      setOrdering(true);
      // Step 1: Create an order from the backend
      const { data } = await axios.post(`/api/razorpay/create-order`, {
        amount: amount,
        currency: "INR",
        receipt: "receipt#123",
      });

      const { order } = data;
      // Step 2: Configure Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "", // Ensure key is always a string
        amount: order.amount, // Amount in subunits (e.g., 50000 paise = ₹500.00)
        currency: order.currency,
        name: "Kanha Restaurant",
        description: "Test Transaction",
        // image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM8zKfR3BZqyxwFGuqTOH1wPe1JGyeHvdcHw&s", // Optional logo
        order_id: order.id, // Pass the `order_id` obtained from backend
        handler: function () {

          // Handle successful payment ---->Updating the wallet
          toast.success("Payment Successful!");
          handleOrder();
          // Send response to the backend for verification (optional)
        },
        prefill: {
          name: name,
          email: "",
          contact: phone,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response : { error: { code: string; description: string; source: string; step: string; reason: string; metadata: { order_id: string; payment_id: string } } }) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });
      // Open the Razorpay checkout
      rzp1.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
    }
  };

  return (
    <div>
      <Button onClick={handlePayment}
      disabled={disable}
      className="w-full bg-amber-700 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-amber-700/40 transition">Pay</Button>
    </div>
  );
}
