import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ 
        error: 'MISSING_ADDRESS', 
        message: 'Address is required' 
      }, { status: 400 });
    }

    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!googleMapsApiKey) {
      return NextResponse.json({ 
        error: 'API_KEY_MISSING', 
        message: 'Google Maps API key is not configured' 
      }, { status: 500 });
    }

    // Use Google Geocoding API
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`;
    
    const response = await fetch(geocodeUrl);
    const data = await response.json();

    if (data.status !== 'OK') {
      let errorMessage = 'Failed to geocode address';
      
      switch (data.status) {
        case 'ZERO_RESULTS':
          errorMessage = 'Address not found. Please check the address and try again.';
          break;
        case 'OVER_QUERY_LIMIT':
          errorMessage = 'Geocoding quota exceeded. Please try again later.';
          break;
        case 'REQUEST_DENIED':
          errorMessage = 'Geocoding request denied. API key may be invalid or Geocoding API may not be enabled.';
          break;
        case 'INVALID_REQUEST':
          errorMessage = 'Invalid address format. Please enter a valid address.';
          break;
        default:
          errorMessage = `Geocoding failed: ${data.status}`;
      }

      return NextResponse.json({ 
        error: data.status, 
        message: errorMessage 
      }, { status: 400 });
    }

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ 
        error: 'NO_RESULTS', 
        message: 'No results found for the provided address' 
      }, { status: 400 });
    }

    const result = data.results[0];
    const location = result.geometry.location;
    
    // Extract address components
    let city = '';
    let province = '';
    let postalCode = '';
    
    for (const component of result.address_components) {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        province = component.short_name;
      } else if (component.types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    }

    return NextResponse.json({
      latitude: location.lat,
      longitude: location.lng,
      city,
      province,
      postalCode,
      formattedAddress: result.formatted_address
    });

  } catch (error) {
    console.error('Geocoding API error:', error);
    return NextResponse.json({ 
      error: 'INTERNAL_ERROR', 
      message: 'Internal server error while geocoding' 
    }, { status: 500 });
  }
}
