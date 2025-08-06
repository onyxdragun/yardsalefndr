"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Phone, Mail, Navigation, Map, List, ChevronDown } from "lucide-react";
import { GoogleMap } from "./GoogleMap";
import FavoriteButton from "./FavoriteButton";
import { getNavigationUrl, getNavigationUrls } from "@/lib/navigation";

interface GarageSale {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  categories: string[];
  contactInfo: {
    name: string;
    email?: string;
    phone?: string;
  };
  isFavorited?: boolean;
}

interface GarageSaleMarker {
  id: string;
  title: string;
  position: { lat: number; lng: number };
  address: string;
  startDate: string;
  startTime: string;
  categories: string[];
}

export function MapView() {
  const [garageSales, setGarageSales] = useState<GarageSale[]>([]);
  const [selectedSale, setSelectedSale] = useState<GarageSale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(true); // For mobile toggle
  const [showNavigationOptions, setShowNavigationOptions] = useState<string | null>(null); // For navigation dropdown

  const defaultCenter = { lat: 49.6866, lng: -125.0000 }; // Courtenay, BC
  useEffect(() => {
    fetchGarageSales();
    getUserLocation();
  }, []);

  // Close navigation dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNavigationOptions) {
        const target = event.target as Element;
        if (!target.closest('.navigation-dropdown-container')) {
          setShowNavigationOptions(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNavigationOptions]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting user location:', error);
          // Use default location if geolocation fails
        }
      );
    }
  };

  const fetchGarageSales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/garage-sales');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Extract the garage sales array from the paginated response
      const salesData = result.data?.garageSales || [];
      
      // Transform the database data to match our component interface
      const transformedSales: GarageSale[] = salesData.map((sale: any) => {
        const lat = parseFloat(sale.latitude);
        const lng = parseFloat(sale.longitude);
        
        // Build address string safely
        const addressParts = [sale.address, sale.city, sale.province];
        if (sale.postal_code) {
          addressParts.push(sale.postal_code);
        }
        const fullAddress = addressParts.filter(part => part).join(', ');
        
        return {
          id: sale.id.toString(),
          title: sale.title,
          address: fullAddress,
          latitude: !isNaN(lat) ? lat : 0,
          longitude: !isNaN(lng) ? lng : 0,
          startDate: sale.startDate,
          endDate: sale.endDate,
          startTime: sale.startTime,
          endTime: sale.endTime,
          description: sale.description || '',
          categories: sale.categories || [],
          contactInfo: {
            name: 'Contact', // Default name since we don't have contact_name in DB
            email: sale.contactEmail || undefined,
            phone: sale.contactPhone || sale.phone || undefined
          }
        };
      }).filter((sale: GarageSale) => sale.latitude !== 0 && sale.longitude !== 0); // Filter out invalid coordinates
      
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today for proper comparison
      const upcomingSales = transformedSales.filter(sale => {
        const end = sale.endDate ? new Date(sale.endDate) : null;
        return end && end >= today;
      });
      setGarageSales(upcomingSales);
    } catch (err) {
      console.error('Error fetching garage sales:', err);
      setError('Failed to load garage sales. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Convert garage sales to markers for Google Maps
  const markers: GarageSaleMarker[] = garageSales.map(sale => ({
    id: sale.id,
    title: sale.title,
    position: { lat: sale.latitude, lng: sale.longitude },
    address: sale.address,
    startDate: sale.startDate,
    startTime: sale.startTime,
    categories: sale.categories
  }));

  const handleMarkerClick = (marker: GarageSaleMarker) => {
    const sale = garageSales.find(s => s.id === marker.id);
    setSelectedSale(sale || null);
    
    // On mobile, automatically switch to List tab to show the selected sale details
    if (window.innerWidth < 1024) { // lg breakpoint
      setShowMap(false);
    }
    
    // Track view when user clicks on a marker
    if (sale) {
      trackView(parseInt(sale.id));
    }
  };

  // Function to track view (we'll call this manually instead of using the hook)
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
  const handleGetDirections = (sale: GarageSale, appType?: string) => {
    const navigationOptions = {
      address: sale.address,
      latitude: sale.latitude,
      longitude: sale.longitude,
      title: sale.title
    };

    let url: string;
    
    if (appType) {
      // User selected a specific app
      const urls = getNavigationUrls(navigationOptions);
      switch (appType) {
        case 'google':
          url = urls.googleMaps;
          break;
        case 'apple':
          url = urls.appleMaps;
          break;
        case 'waze':
          url = urls.waze;
          break;
        case 'universal':
          url = urls.universal;
          break;
        default:
          url = getNavigationUrl(navigationOptions);
      }
    } else {
      // Use smart detection
      url = getNavigationUrl(navigationOptions);
    }

    // Open the navigation URL
    window.open(url, '_blank');
    
    // Close dropdown if it was open
    setShowNavigationOptions(null);
  };

  const mapCenter = userLocation || defaultCenter;

  const getCategoryColor = (categories: string[]) => {
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
    
    const primaryCategory = categories[0];
    return colors[primaryCategory as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* Mobile Toggle Buttons */}
      <div className="lg:hidden flex bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowMap(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium ${
            showMap
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Map className="h-5 w-5" />
          Map
        </button>
        <button
          onClick={() => setShowMap(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium ${
            !showMap
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <List className="h-5 w-5" />
          <span>List</span>
          {garageSales.length > 0 && (
            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
              !showMap
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}>
              {garageSales.length}
            </span>
          )}
          {/* Show indicator when a sale is selected */}
          {selectedSale && (
            <span className={`ml-1 w-2 h-2 rounded-full ${
              !showMap
                ? 'bg-yellow-300'
                : 'bg-blue-500'
            }`} title="Sale selected">
            </span>
          )}
        </button>
      </div>

      {/* Map View */}
      <div className={`flex-1 relative min-h-[50vh] lg:min-h-0 ${showMap ? 'block' : 'hidden lg:block'}`}>
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading garage sales...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={fetchGarageSales}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Google Map */}
        <GoogleMap
          center={mapCenter}
          zoom={11}
          markers={markers}
          onMarkerClick={handleMarkerClick}
          style={{ width: '100%', height: '100%' }}
        />
        
        {/* Floating List Toggle Button - Mobile Only */}
        <button
          onClick={() => setShowMap(false)}
          className="lg:hidden absolute bottom-4 right-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <List className="h-5 w-5" />
        </button>
      </div>
      
      {/* Sidebar/List View */}
      <div className={`w-full lg:w-96 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto relative ${
        showMap ? 'hidden lg:block' : 'block'
      }`}>
        {/* Floating Map Toggle Button - Mobile Only */}
        <button
          onClick={() => setShowMap(true)}
          className="lg:hidden absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
        >
          <Map className="h-5 w-5" />
        </button>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Garage Sales
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : error ? 'Error loading sales' : `${garageSales.length} sales found`}
          </p>
        </div>
        
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>Unable to load garage sales.</p>
              <button 
                onClick={fetchGarageSales}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : garageSales.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>No garage sales found.</p>
              <p className="text-sm mt-2">Be the first to add one!</p>
            </div>
          ) : (
            garageSales.map((sale: GarageSale) => (
            <div key={sale.id} className="space-y-2">
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSale?.id === sale.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedSale(selectedSale?.id === sale.id ? null : sale)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {sale.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <FavoriteButton 
                      garageSaleId={parseInt(sale.id)} 
                      initialIsFavorited={sale.isFavorited}
                      size="sm"
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent expanding the card
                        handleGetDirections(sale);
                      }}
                      className="text-gray-400 hover:text-blue-600 cursor-pointer p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Get directions"
                    >
                      <Navigation className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{sale.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>
                      {sale.startDate ? new Date(sale.startDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Date TBD'} • {sale.startTime || 'Time TBD'} - {sale.endTime || 'Time TBD'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {sale.categories.slice(0, 3).map((category: any, index: number) => {
                      const categoryName = typeof category === 'string' ? category : category.name || category.slug;
                      const categoryKey = typeof category === 'string' ? category : category.slug || category.name || index;
                      
                      return (
                        <span
                          key={categoryKey}
                          className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(sale.categories)}`}
                        >
                          {categoryName?.replace('-', ' ') || 'Category'}
                        </span>
                      );
                    })}
                    {sale.categories.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                        +{sale.categories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded details for selected sale */}
              {selectedSale?.id === sale.id && (
                <div className="ml-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Sale Details
                  </h4>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {sale.description}
                      </p>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Contact Info:</span>
                      <div className="mt-1 space-y-1">
                        {sale.contactInfo.phone && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Phone className="h-4 w-4" />
                            <span>{sale.contactInfo.phone}</span>
                          </div>
                        )}
                        {sale.contactInfo.email && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Mail className="h-4 w-4" />
                            <span>{sale.contactInfo.email}</span>
                          </div>
                        )}
                        {!sale.contactInfo.phone && !sale.contactInfo.email && (
                          <div className="text-gray-500 dark:text-gray-400 text-sm">
                            No contact information available
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">All Categories:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sale.categories.map((category: any, index: number) => {
                          const categoryName = typeof category === 'string' ? category : category.name || category.slug;
                          const categoryKey = typeof category === 'string' ? category : category.slug || category.name || index;
                          
                          return (
                            <span
                              key={categoryKey}
                              className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(sale.categories)}`}
                            >
                              {categoryName?.replace('-', ' ') || 'Category'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        {/* Navigation Button Group */}
                        <div className="flex-1 relative navigation-dropdown-container">
                          <div className="flex">
                            <button 
                              onClick={() => handleGetDirections(sale)}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-l-lg hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              <Navigation className="h-4 w-4" />
                              Get Directions
                            </button>
                            <button
                              onClick={() => setShowNavigationOptions(
                                showNavigationOptions === sale.id ? null : sale.id
                              )}
                              className="bg-blue-600 text-white py-2 px-2 rounded-r-lg hover:bg-blue-700 transition-colors cursor-pointer border-l border-blue-500"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Navigation Options Dropdown */}
                          {showNavigationOptions === sale.id && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                              <div className="py-1">
                                <button
                                  onClick={() => handleGetDirections(sale, 'google')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                  Open in Google Maps
                                </button>
                                <button
                                  onClick={() => handleGetDirections(sale, 'apple')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                  Open in Apple Maps
                                </button>
                                <button
                                  onClick={() => handleGetDirections(sale, 'waze')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                  Open in Waze
                                </button>
                                <button
                                  onClick={() => handleGetDirections(sale, 'universal')}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                >
                                  Choose Navigation App
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <FavoriteButton 
                          garageSaleId={parseInt(sale.id)}
                          initialIsFavorited={sale.isFavorited}
                          showText={true}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
}
