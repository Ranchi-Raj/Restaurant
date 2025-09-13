import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">☕</span>
              <h3 className="text-xl font-serif font-bold text-white">Cafe Delight</h3>
            </div>
            <p className="text-stone-400 leading-relaxed">
              Serving the finest coffee and delicious meals in a warm, welcoming atmosphere since 2020.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Facebook</span>📘
              </a>
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Instagram</span>📷
              </a>
              <a href="#" className="text-stone-400 hover:text-amber-400 transition-colors">
                <span className="sr-only">Twitter</span>🐦
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-stone-300">123 Coffee Street</p>
                  <p className="text-stone-300">Downtown, City 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-stone-300">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-stone-300">hello@cafedelight.com</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Opening Hours</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-stone-300 font-medium">Monday - Friday</p>
                  <p className="text-stone-400 text-sm">7:00 AM - 9:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-stone-300 font-medium">Saturday - Sunday</p>
                  <p className="text-stone-400 text-sm">8:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links - Uncommented and made responsive */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="#menu" className="block text-stone-300 hover:text-amber-400 transition-colors">
                Our Menu
              </a>
              <a href="#about" className="block text-stone-300 hover:text-amber-400 transition-colors">
                About Us
              </a>
              <a href="#reservations" className="block text-stone-300 hover:text-amber-400 transition-colors">
                Reservations
              </a>
              <a href="#catering" className="block text-stone-300 hover:text-amber-400 transition-colors">
                Catering
              </a>
              <a href="#events" className="block text-stone-300 hover:text-amber-400 transition-colors">
                Private Events
              </a>
              <a href="#careers" className="block text-stone-300 hover:text-amber-400 transition-colors">
                Careers
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-stone-400 text-sm">© 2024 Cafe Delight. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <a href="#privacy" className="text-stone-400 hover:text-amber-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-stone-400 hover:text-amber-400 transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-stone-400 hover:text-amber-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}