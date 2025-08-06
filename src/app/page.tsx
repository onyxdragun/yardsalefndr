import Link from "next/link";
import { MapPin, Search, Route, PlusCircle } from "lucide-react";
import { CompactMapWidget } from "@/components/CompactMapWidget";
import { SignUpIncentive } from "@/components/SignUpIncentive";
import { Metadata } from "next";
import { organizationStructuredData, websiteStructuredData, webApplicationStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Find Garage Sales Near You",
  description: "Discover garage sales, yard sales, and estate sales in your area. Browse our interactive map, search by location, and never miss a great deal again.",
  openGraph: {
    title: "Find Garage Sales Near You | YardSaleFndr",
    description: "Discover garage sales, yard sales, and estate sales in your area. Browse our interactive map and find hidden treasures in your community.",
  }
};

export default function Home() {
  return (
    <div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationStructuredData,
            websiteStructuredData,
            webApplicationStructuredData
          ])
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Find Garage Sales
              <span className="text-blue-600"> Near You</span>
            </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Discover hidden treasures, plan your weekend routes, and never miss a great deal again.
            Connect with your community and find exactly what you&apos;re looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/map" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <MapPin className="h-5 w-5" />
              View Map
            </Link>
            <Link 
              href="/add" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Add Your Sale
            </Link>
          </div>
        </div>

        {/* Compact Map Widget */}
        <div className="max-w-2xl mx-auto mb-16">
          <CompactMapWidget />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <MapPin className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Interactive Map
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              See all garage sales in your area on an interactive map. Enable location access to find sales near you with distances and directions.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <Search className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Smart Search
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Find exactly what you&apos;re looking for with our category-based search and filtering system.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <Route className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Route Planning
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Plan efficient routes between multiple garage sales to maximize your treasure hunting time.
            </p>
          </div>
        </div>

        {/* Sign Up Incentive for Non-Authenticated Users */}
        <SignUpIncentive />

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Popular Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Electronics", icon: "📱" },
              { name: "Clothing", icon: "👕" },
              { name: "Toys", icon: "🧸" },
              { name: "Books", icon: "📚" },
              { name: "Furniture", icon: "🪑" },
              { name: "Appliances", icon: "🔌" },
              { name: "Home Decor", icon: "🖼️" },
              { name: "Sports", icon: "⚽" },
              { name: "Tools", icon: "🔧" },
              { name: "Collectibles", icon: "🏺" },
              { name: "Baby & Kids", icon: "🍼" },
              { name: "Miscellaneous", icon: "📦" }
            ].map((category, index) => (
              <div key={index} className="text-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Global SEO Content */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Garage Sales Worldwide
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            <p className="mb-4">
              YardSaleFndr is your go-to resource for finding garage sales, yard sales, and estate sales in your area. 
              Whether you&apos;re in North America, Europe, Australia, or anywhere else in the world, we help you discover amazing deals 
              and hidden treasures in your local community.
            </p>
            <p className="mb-4">
              Our interactive map shows real-time garage sale listings with precise locations, sale times, and item categories. 
              Find everything from furniture and electronics to collectibles and clothing. Never miss a great deal again with our 
              location-based notifications and smart search features.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Popular Sale Types</h3>
                <ul className="space-y-2">
                  <li>• Garage Sales</li>
                  <li>• Yard Sales</li>
                  <li>• Estate Sales</li>
                  <li>• Moving Sales</li>
                  <li>• Multi-Family Sales</li>
                  <li>• Community Sales</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Find Items</h3>
                <ul className="space-y-2">
                  <li>• Furniture & Home Decor</li>
                  <li>• Electronics & Gadgets</li>
                  <li>• Clothing & Accessories</li>
                  <li>• Books & Media</li>
                  <li>• Toys & Games</li>
                  <li>• Collectibles & Antiques</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}