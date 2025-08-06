"use client";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useEffect, useRef, useState, ReactElement } from "react";

interface GarageSaleMarker {
  id: string;
  title: string;
  position: { lat: number; lng: number };
  address: string;
  startDate: string;
  startTime: string;
  categories: string[];
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  markers: GarageSaleMarker[];
  onMarkerClick?: (marker: GarageSaleMarker) => void;
  style?: React.CSSProperties;
}

// Map component that uses the Google Maps JavaScript API
function Map({ center, zoom, markers, onMarkerClick, style }: GoogleMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [mapMarkers, setMapMarkers] = useState<(google.maps.marker.AdvancedMarkerElement | google.maps.Marker)[]>([]);

  useEffect(() => {
    if (ref.current && !map) {
      const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";
      
      console.log('Initializing map with ID:', mapId);
      
      const mapOptions: google.maps.MapOptions = {
        center,
        zoom,
        mapId, // Use custom Map ID from env
      };

      // Only add styles if using the demo map ID
      if (mapId === "DEMO_MAP_ID") {
        mapOptions.styles = [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ];
      }

      try {
        const newMap = new google.maps.Map(ref.current, mapOptions);
        
        // Add error listener for map loading issues
        google.maps.event.addListener(newMap, 'tilesloaded', () => {
          console.log('Map tiles loaded successfully');
        });
        
        setMap(newMap);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }
  }, [ref, map, center, zoom]);

  // Update map center when center prop changes
  useEffect(() => {
    if (map) {
      map.setCenter(center);
    }
  }, [map, center]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (map) {
      // Clear existing markers
      mapMarkers.forEach(marker => {
        if (marker instanceof google.maps.Marker) {
          marker.setMap(null);
        } else if ('map' in marker) {
          marker.map = null;
        }
      });
      
      // Create new markers
      const newMarkers = markers
        .filter(markerData => {
          // Validate coordinates
          const lat = markerData.position.lat;
          const lng = markerData.position.lng;
          return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
        })
        .map(markerData => {
        // Try to use AdvancedMarkerElement if available
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
          // Create a custom pin element
          const pinElement = document.createElement('div');
          pinElement.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `;
          pinElement.style.cursor = 'pointer';
          pinElement.title = markerData.title;

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: markerData.position,
            map,
            title: markerData.title,
            content: pinElement
          });

          // Add click listener
          pinElement.addEventListener('click', () => {
            if (onMarkerClick) {
              onMarkerClick(markerData);
            }
          });

          return marker;
        } else {
          // Fallback to regular Marker
          const marker = new google.maps.Marker({
            position: markerData.position,
            map,
            title: markerData.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#EF4444',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          });

          // Add click listener
          marker.addListener('click', () => {
            if (onMarkerClick) {
              onMarkerClick(markerData);
            }
          });

          return marker;
        }
      });

      setMapMarkers(newMarkers);
    }
  }, [map, markers, onMarkerClick]);

  return <div ref={ref} style={style} />;
}

// Render function for when the Google Maps API fails to load
const render = (status: Status): ReactElement => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading Google Maps...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Google Maps API Error
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              The Google Maps API key needs to be configured properly.
            </p>
            <div className="text-left bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-xs">
              <p className="font-medium mb-2">To fix this:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a></li>
                <li>Enable the Maps JavaScript API</li>
                <li>Update API key restrictions to allow localhost:3000</li>
                <li>Add HTTP referrers: http://localhost:3000/* and https://localhost:3000/*</li>
              </ol>
            </div>
          </div>
        </div>
      );
    default:
      return <></>;
  }
};

// Main Google Map component
export function GoogleMap({ center, zoom, markers, onMarkerClick, style }: GoogleMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">⚠️</div>
          <p className="text-yellow-600 dark:text-yellow-400">Google Maps API key not configured</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render} libraries={["places", "marker"]} version="weekly">
      <Map 
        center={center} 
        zoom={zoom} 
        markers={markers} 
        onMarkerClick={onMarkerClick}
        style={style || { width: "100%", height: "100%" }}
      />
    </Wrapper>
  );
}
