"use client";

import { useState, useEffect } from "react";
import { ITEM_CATEGORIES } from "@/types";
import { Search, MapPin, Calendar, Filter, X } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { getCurrentLocation, calculateDistance, formatDistance, type Location } from "@/lib/distance";
import { getNavigationUrl } from "@/lib/navigation";

interface SearchFilters {
  keywords: string;
  location: string;
  radius: number;
  startDate: string;
  endDate: string;
  categories: string[];
}

export function SearchForm() {
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: "",
    location: "",
    radius: 15,
    startDate: "",
    endDate: "",
    categories: []
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Try to get user location on component mount
  useEffect(() => {
    const getLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
        setLocationPermission('granted');
      } else {
        setLocationPermission('denied');
      }
    };
    
    getLocation();
  }, []);

  // Function to track view when user clicks on a garage sale
  const trackView = async (garageSaleId: number) => {
    try {
      await fetch(`/api/garage-sales/${garageSaleId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to track view:', error);
      // Don't show error to user, view tracking is not critical
    }
  };

  // Function to handle navigation
  const handleGetDirections = (sale: any) => {
    const navigationOptions = {
      address: sale.address,
      latitude: parseFloat(sale.latitude),
      longitude: parseFloat(sale.longitude),
      title: sale.title
    };

    const url = getNavigationUrl(navigationOptions);
    window.open(url, '_blank');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSearching(true);
      setHasSearched(true);
      setSearchResults([]);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.keywords) params.append('keywords', filters.keywords);
      if (filters.location) params.append('location', filters.location);
      
      // Only add radius if user location is available
      if (filters.radius && userLocation) {
        params.append('radius', filters.radius.toString());
      }
      
      if (filters.categories.length > 0) params.append('categories', filters.categories.join(','));
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      // Add user location for distance calculation
      if (userLocation) {
        params.append('userLat', userLocation.latitude.toString());
        params.append('userLng', userLocation.longitude.toString());
      }
      
      console.log('Search params:', params.toString());
      
      const response = await fetch(`/api/garage-sales?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to search garage sales');
      }
      
      const result = await response.json();
      console.log('Search result:', result);
      
      // Extract the garage sales array from the paginated response
      const salesData = result.data?.garageSales || [];
      
      // Transform the database data to match our component interface
      const transformedResults = salesData.map((sale: any) => {
        let distance = 0;
        
        // Calculate distance if user location and garage sale coordinates are available
        if (userLocation && sale.latitude && sale.longitude) {
          distance = calculateDistance(userLocation, {
            latitude: parseFloat(sale.latitude),
            longitude: parseFloat(sale.longitude)
          });
        }
        
        return {
          id: sale.id.toString(),
          title: sale.title,
          address: `${sale.address}, ${sale.city}, ${sale.province} ${sale.postalCode || ''}`.replace(/null/g, '').replace(/\s+/g, ' ').trim(),
          distance,
          startDate: sale.startDate,
          endDate: sale.endDate,
          startTime: sale.startTime,
          endTime: sale.endTime,
          categories: sale.categories || [],
          description: sale.description || '',
          isFavorited: sale.isFavorited || false
        };
      });
      
      setSearchResults(transformedResults);
      
      // Show helpful message if no results found with radius filter
      if (transformedResults.length === 0 && filters.radius && userLocation) {
        console.log(`No garage sales found within ${filters.radius}km of your location`);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Show user-friendly error message
      alert(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      keywords: "",
      location: "",
      radius: 15,
      startDate: "",
      endDate: "",
      categories: []
    });
    setSearchResults([]);
    setHasSearched(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      furniture: "bg-brown-100 text-brown-800",
      electronics: "bg-blue-100 text-blue-800",
      clothing: "bg-pink-100 text-pink-800",
      books: "bg-green-100 text-green-800",
      toys: "bg-purple-100 text-purple-800",
      appliances: "bg-orange-100 text-orange-800",
      "home-decor": "bg-yellow-100 text-yellow-800",
      "baby-kids": "bg-indigo-100 text-indigo-800",
      collectibles: "bg-amber-100 text-amber-800",
      sports: "bg-red-100 text-red-800",
      kitchen: "bg-teal-100 text-teal-800",
      tools: "bg-slate-100 text-slate-800",
      miscellaneous: "bg-gray-100 text-gray-800"
    };
    
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-6">
        {/* Basic Search */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What are you looking for?
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={filters.keywords}
                  onChange={handleInputChange}
                  placeholder="e.g., vintage records, baby clothes, furniture"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="w-64">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleInputChange}
                  placeholder="City, Province or Postal Code"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Location Info Banner */}
          {!userLocation && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    Get better search results with location access
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Allow location access to search within a specific radius and see distances to garage sales near you.
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      const location = await getCurrentLocation();
                      if (location) {
                        setUserLocation(location);
                        setLocationPermission('granted');
                      }
                    }}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium mt-2 underline"
                  >
                    Enable Location Access
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              <Filter className="h-4 w-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
            </button>
            
            {(filters.categories.length > 0 || filters.startDate || filters.endDate) && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
            
            {/* Distance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="radius" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Search Radius: {filters.radius} km
                </label>
                {locationPermission === 'denied' && (
                  <button
                    type="button"
                    onClick={async () => {
                      const location = await getCurrentLocation();
                      if (location) {
                        setUserLocation(location);
                        setLocationPermission('granted');
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Enable Location
                  </button>
                )}
              </div>
              <input
                type="range"
                id="radius"
                name="radius"
                min="5"
                max="50"
                value={filters.radius}
                onChange={handleInputChange}
                className="w-full"
                disabled={!userLocation}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 km</span>
                <span>50 km</span>
              </div>
              {!userLocation && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-3 mt-2">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    📍 <strong>Enable location access</strong> to search within a specific radius and see distances to garage sales.
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Without location access, you can still search by keywords, location text, dates, and categories.
                  </p>
                </div>
              )}
              {userLocation && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md p-3 mt-2">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    📍 <strong>Location enabled</strong> - Searching within {filters.radius}km radius
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Note: Location accuracy may vary. If you don&apos;t see expected results, try increasing the search radius.
                  </p>
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Item Categories
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {ITEM_CATEGORIES.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search Garage Sales'}
          </button>
        </div>
      </form>

      {/* No Results Message */}
      {searchResults.length === 0 && !isSearching && hasSearched && (
        <div className="mt-8 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No garage sales found
              </h3>
              {filters.radius && userLocation ? (
                <p className="text-sm">
                  No garage sales found within {filters.radius}km of your location. 
                  <br />
                  Try increasing the search radius or expanding your search area.
                </p>
              ) : (
                <p className="text-sm">
                  Try adjusting your search criteria or check back later for new listings.
                </p>
              )}
            </div>
            <button
              onClick={() => setFilters({ ...filters, radius: 25 })}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              {filters.radius && userLocation ? 'Expand search radius' : 'Clear filters and search again'}
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Search Results ({searchResults.length} found)
          </h3>
          
          <div className="space-y-4">
            {searchResults.map((sale) => (
              <div key={sale.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {sale.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <FavoriteButton 
                      garageSaleId={parseInt(sale.id)} 
                      initialIsFavorited={sale.isFavorited}
                      size="sm"
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {sale.distance > 0 ? formatDistance(sale.distance) : 'Distance unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{sale.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(sale.startDate).toLocaleDateString()} • {sale.startTime} - {sale.endTime}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {sale.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {sale.categories.map((category: any, index: number) => {
                      const categoryName = typeof category === 'string' ? category : category.name || category.slug;
                      const categoryKey = typeof category === 'string' ? category : category.slug || category.name || index;
                      
                      return (
                        <span
                          key={categoryKey}
                          className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(categoryKey)}`}
                        >
                          {categoryName?.replace('-', ' ') || 'Category'}
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => trackView(parseInt(sale.id))}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleGetDirections(sale)}
                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
