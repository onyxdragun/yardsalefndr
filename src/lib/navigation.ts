// src/lib/navigation.ts
export interface NavigationOptions {
  address: string;
  latitude?: number;
  longitude?: number;
  title?: string;
}

export function getNavigationUrl(options: NavigationOptions): string {
  const { address, latitude, longitude, title } = options;
  
  // Use coordinates if available, otherwise use address
  const destination = latitude && longitude 
    ? `${latitude},${longitude}`
    : encodeURIComponent(address);
    
  const label = title ? encodeURIComponent(title) : '';
  
  // Detect platform and return appropriate URL
  const userAgent = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  if (isIOS) {
    // iOS - Opens Apple Maps by default, but will show options if other apps installed
    return latitude && longitude 
      ? `http://maps.apple.com/?daddr=${destination}&ll=${destination}`
      : `http://maps.apple.com/?daddr=${destination}`;
  } else if (isAndroid) {
    // Android - Opens Google Maps or shows app chooser
    return latitude && longitude
      ? `geo:${destination}?q=${destination}(${label})`
      : `geo:0,0?q=${destination}`;
  } else {
    // Desktop/Web - Opens Google Maps in browser
    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  }
}

// Alternative: Multiple app options
export function getNavigationUrls(options: NavigationOptions) {
  const { address, latitude, longitude, title } = options;
  const destination = latitude && longitude 
    ? `${latitude},${longitude}`
    : encodeURIComponent(address);
  const label = title ? encodeURIComponent(title) : '';
  
  return {
    googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
    appleMaps: latitude && longitude 
      ? `http://maps.apple.com/?daddr=${destination}&ll=${destination}`
      : `http://maps.apple.com/?daddr=${destination}`,
    waze: latitude && longitude 
      ? `https://waze.com/ul?ll=${destination}&navigate=yes`
      : `https://waze.com/ul?q=${destination}&navigate=yes`,
    // Universal geo link (works on most mobile devices)
    universal: latitude && longitude
      ? `geo:${destination}?q=${destination}(${label})`
      : `geo:0,0?q=${destination}`
  };
}
