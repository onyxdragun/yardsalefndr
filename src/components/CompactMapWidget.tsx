"use client";

import { useState, useEffect } from "react";
import { MapPin, Crosshair, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { GoogleMap } from "./GoogleMap";

// Types for garage sale data
interface GarageSaleData {
  id: string;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  startDate: string;
  startTime: string;
  categories: string[];
}

interface GarageSaleWithDistance extends GarageSaleData {
  distance: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

// Format time function
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Format date function
const formatDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export function CompactMapWidget() {
  const [nearbyGarageSales, setNearbyGarageSales] = useState<GarageSaleData[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNearbyGarageSales();
  }, []);

  const fetchNearbyGarageSales = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/garage-sales');
      if (!response.ok) {
        throw new Error('Failed to fetch garage sales');
      }
      
      const result = await response.json();
      
      // Extract the garage sales array from the paginated response
      const salesData = result.data?.garageSales || [];
      
      // Transform the database data to match our component interface
      // Filter out sales without valid coordinates and only take sales with lat/lng
      const transformedSales: GarageSaleData[] = salesData
        .filter((sale: any) => sale.latitude && sale.longitude && 
                              !isNaN(parseFloat(sale.latitude)) && 
                              !isNaN(parseFloat(sale.longitude)))
        .slice(0, 3)
        .map((sale: any) => ({
          id: sale.id.toString(),
          title: sale.title,
          address: sale.city && sale.province 
            ? `${sale.address}, ${sale.city}, ${sale.province}`
            : sale.address,
          latitude: parseFloat(sale.latitude),
          longitude: parseFloat(sale.longitude),
          startDate: sale.startDate,
          startTime: sale.startTime,
          categories: sale.categories?.map((cat: any) => cat.name || cat) || []
        }));
      
      setNearbyGarageSales(transformedSales);
    } catch (err) {
      console.error('Error fetching garage sales:', err);
      setError('Failed to load garage sales');
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocation = async () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setIsLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setLocationPermission('granted');
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationPermission('denied');
    }
    
    setIsLoading(false);
  };

  // Calculate distance between two points (simplified)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const nearbySales = userLocation 
    ? nearbyGarageSales
        .map((sale: GarageSaleData) => ({
          ...sale,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            sale.latitude,
            sale.longitude
          )
        }))
        .sort((a: GarageSaleWithDistance, b: GarageSaleWithDistance) => a.distance - b.distance)
        .slice(0, 3)
    : nearbyGarageSales.slice(0, 3);

  // Type guard to check if sale has distance property
  const hasDistance = (sale: GarageSaleData | GarageSaleWithDistance): sale is GarageSaleWithDistance => {
    return 'distance' in sale;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Nearby Garage Sales
            </h3>
          </div>
          <Link 
            href="/map" 
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            View All
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
        {/* Google Maps */}
        <GoogleMap
          center={userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : { lat: 49.6866, lng: -125.0000 }}
          zoom={userLocation ? 12 : 10}
          markers={nearbySales.map((sale: GarageSaleData | GarageSaleWithDistance) => ({
            id: sale.id,
            title: sale.title,
            position: { lat: sale.latitude, lng: sale.longitude },
            address: sale.address,
            startDate: sale.startDate,
            startTime: sale.startTime,
            categories: []
          }))}
          onMarkerClick={() => {
            // Optional: Handle marker click
          }}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Loading...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center max-w-xs">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>
              <button
                onClick={fetchNearbyGarageSales}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Location Request Overlay */}
        {locationPermission === 'prompt' && !isLoading && !error && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center max-w-xs">
              <Crosshair className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Allow location access to see garage sales near you
              </p>
              <button
                onClick={requestLocation}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? 'Getting Location...' : 'Enable Location'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sales List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-1" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">Unable to load garage sales</p>
          </div>
        ) : nearbyGarageSales.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No garage sales found</p>
            <p className="text-xs mt-1">Be the first to add one!</p>
          </div>
        ) : (
          nearbySales.map((sale: GarageSaleData | GarageSaleWithDistance) => (
            <div key={sale.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {sale.title}
                  </h4>
                  {userLocation && hasDistance(sale) && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {sale.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(sale.startDate)} • {formatTime(sale.startTime)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
