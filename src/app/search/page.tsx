import { SearchForm } from "@/components/SearchForm";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>
              <div className="flex items-center gap-2">
                <Search className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Search Garage Sales
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Find Your Perfect Garage Sale
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Use our advanced search to find garage sales that match exactly what you&apos;re looking for.
              Filter by location, date, and item categories to discover the best deals.
            </p>
            
            <SearchForm />
          </div>
        </div>
      </main>
    </div>
  );
}
