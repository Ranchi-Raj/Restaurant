import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-amber-600"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-orange-500"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-stone-600"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 mb-6 leading-tight">
            Welcome to
            <span className="block text-amber-700 mt-2">Cafe Delight</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-stone-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Experience the perfect blend of flavors, crafted with passion and served with love in our cozy atmosphere
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
              <span className="text-lg">☕</span>
              <span className="text-stone-700 font-medium">Fresh Coffee</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
              <span className="text-lg">🥐</span>
              <span className="text-stone-700 font-medium">Fresh Pastries</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
              <span className="text-lg">🌱</span>
              <span className="text-stone-700 font-medium">Organic Ingredients</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-amber-700 hover:bg-amber-800 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              View Our Menu
            </Button>
            {/* <Button
              variant="outline"
              size="lg"
              className="border-stone-300 text-stone-700 hover:bg-stone-50 px-8 py-3 text-lg font-medium bg-transparent"
            >
              Reserve a Table
            </Button> */}
          </div>

          {/* Opening Hours */}
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-stone-200 shadow-sm max-w-md mx-auto">
            <h3 className="font-serif font-semibold text-stone-800 mb-3">Opening Hours</h3>
            <div className="space-y-1 text-stone-600">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>7:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday - Sunday</span>
                <span>8:00 AM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
