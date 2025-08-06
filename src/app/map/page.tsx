import { MapView } from "@/components/MapView";
import { MapPin, ArrowLeft, Search, Filter } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garage Sale Map",
  description: "Interactive map of garage sales in your area. Find sales near you, get directions, and discover hidden treasures in your neighborhood.",
  openGraph: {
    title: "Garage Sale Map | YardSaleFndr",
    description: "Interactive map of garage sales in your area. Find sales near you and get directions to the best deals.",
  }
};

export default function MapPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Secondary Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  <span className="hidden sm:inline">Garage Sale </span>Map
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                <Filter className="h-5 w-5" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <main className="h-[calc(100vh-160px)]">
        <MapView />
      </main>
    </div>
  );
}
