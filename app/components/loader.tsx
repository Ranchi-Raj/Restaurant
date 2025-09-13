import { Loader2 } from "lucide-react";

const MenuLoader = () => {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
          <Loader2 className="w-8 h-8 text-amber-700 animate-pulse absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-xl font-serif font-semibold text-stone-800 mt-4">Loading our delicious menu...</h2>
        <p className="text-stone-600 mt-2">Preparing something special for you</p>
      </div>
    </div>
  );
};

export default MenuLoader;