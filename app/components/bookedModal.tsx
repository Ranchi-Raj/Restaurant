"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, X } from "lucide-react"
import toast from "react-hot-toast"

// Define the props the modal will accept
interface CentralModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
}

export default function CentralModal({ isOpen, onClose, title, content }: CentralModalProps) {
  const [buttonText, setButtonText] = useState("Copy")

  // If the modal is not open, render nothing
  if (!isOpen) {
    return null
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(
      () => {
        toast.success("Copied to clipboard!")
        setButtonText("Copied!")
        // Reset button text after 2 seconds
        setTimeout(() => setButtonText("Copy"), 2000)
      },
      (err) => {
        toast.error("Failed to copy.")
        console.error("Could not copy text: ", err)
      },
    )
  }

  return (
    // Main overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Modal panel */}
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl m-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <h3 className="text-xl font-serif font-semibold text-stone-800">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-5 w-5 text-stone-500" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="mt-6">
          <p className="text-stone-600 mb-3 text-base">Track your order here !</p>
          <div className="flex items-center space-x-3 rounded-lg border bg-stone-50 p-3">
            <input type="text" value={content} className="flex-grow select-all text-stone-700  overflow-hidden" readOnly />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="px-4 bg-white hover:bg-stone-100"
            >
              <Copy className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}