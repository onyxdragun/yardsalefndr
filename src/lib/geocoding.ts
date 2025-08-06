// Geocoding utility functions for address to coordinates conversion

interface GeocodeResult {
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
  postalCode?: string;
  formattedAddress?: string;
}

interface GeocodeError {
  error: string;
  message: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | GeocodeError> {
  if (!address.trim()) {
    return { error: 'INVALID_ADDRESS', message: 'Address cannot be empty' };
  }

  try {
    // Add "BC, Canada" if not already included to improve accuracy for Comox Valley
    const searchAddress = address.toLowerCase().includes('bc') || address.toLowerCase().includes('canada') 
      ? address 
      : `${address}, BC, Canada`;

    const response = await fetch('/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: searchAddress }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { 
        error: result.error || 'GEOCODING_FAILED', 
        message: result.message || 'Failed to geocode address' 
      };
    }

    return result;
  } catch (error) {
    console.error('Geocoding error:', error);
    return { 
      error: 'NETWORK_ERROR', 
      message: 'Network error while geocoding address' 
    };
  }
}

export function isGeocodeError(result: GeocodeResult | GeocodeError): result is GeocodeError {
  return 'error' in result;
}

// Validate if coordinates are within reasonable bounds for BC, Canada
export function validateCoordinates(lat: number, lng: number): boolean {
  // Rough bounds for British Columbia
  const BC_BOUNDS = {
    north: 60.0,
    south: 48.0,
    west: -139.0,
    east: -114.0
  };

  return lat >= BC_BOUNDS.south && 
         lat <= BC_BOUNDS.north && 
         lng >= BC_BOUNDS.west && 
         lng <= BC_BOUNDS.east;
}
