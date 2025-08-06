// API endpoint for garage sales
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { DatabaseService } from '@/lib/database';
import { SearchFilters } from '@/types/database';

// GET /api/garage-sales - Search and list garage sales
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const filters: SearchFilters = {
      keywords: searchParams.get('keywords') || undefined,
      location: searchParams.get('location') || undefined,
      radiusKm: searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : undefined,
      categoryIds: searchParams.get('categories') ? 
        searchParams.get('categories')!.split(',').map(id => parseInt(id)) : undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      sortBy: (searchParams.get('sortBy') as 'date' | 'distance' | 'title') || 'date',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
    };

    // Get the search query from keywords or use empty string
    const searchQuery = filters.keywords || '';
    
    // Calculate pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    // Get user location from query params for distance calculation
    const userLocation = searchParams.get('userLat') && searchParams.get('userLng') ? {
      latitude: parseFloat(searchParams.get('userLat')!),
      longitude: parseFloat(searchParams.get('userLng')!)
    } : undefined;

    const result = await DatabaseService.searchGarageSales(searchQuery, filters, limit, offset, userLocation);
    
    // If user is logged in, get their favorites to add to the response
    if (session?.user?.id) {
      const favoriteIds = await DatabaseService.getFavoriteIds(parseInt(session.user.id));
      
      // Add isFavorited property to each garage sale
      result.garageSales = result.garageSales.map(sale => ({
        ...sale,
        isFavorited: favoriteIds.includes(sale.id)
      }));
    }
    
    return NextResponse.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    console.error('Failed to fetch garage sales:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch garage sales',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error',
    }, { status: 500 });
  }
}

// POST /api/garage-sales - Create a new garage sale
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({
        status: 'error',
        message: 'Authentication required',
      }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    // Check if user can post more garage sales
    const usageCheck = await DatabaseService.checkUserSalesLimit(userId);
    if (!usageCheck.canPost) {
      return NextResponse.json({
        status: 'error',
        message: `You have reached your monthly limit of ${usageCheck.limit} garage sales. Current count: ${usageCheck.currentCount}`,
        usageInfo: usageCheck
      }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.address || !body.startDate || !body.endDate) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing required fields: title, address, startDate, endDate',
      }, { status: 400 });
    }

    // Prepare sale data with authenticated user ID
    const saleData = {
      userId: userId,
      title: body.title,
      description: body.description || '',
      address: body.address,
      city: body.city || 'Comox Valley', // Use provided city or default
      province: body.province || 'BC', // Use provided province or default
      postalCode: body.postalCode || '', // Use provided postal code
      phone: body.contactPhone || '',
      contactEmail: body.contactEmail || '', // Store contact email
      startDate: body.startDate,
      endDate: body.endDate,
      startTime: body.startTime || '09:00',
      endTime: body.endTime || '17:00',
      status: 'active',
      latitude: body.latitude || null, // Use geocoded latitude
      longitude: body.longitude || null, // Use geocoded longitude
    };

    const garageSale = await DatabaseService.createGarageSale(saleData);
    
    // Increment user's sales count for this month
    await DatabaseService.incrementUserSalesCount(userId);
    
    // If categories are provided, add them to the garage sale
    if (body.categories && body.categories.length > 0) {
      await DatabaseService.addCategoriesToGarageSale(garageSale.id, body.categories);
    }
    
    return NextResponse.json({
      status: 'success',
      data: garageSale,
      message: 'Garage sale created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create garage sale:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create garage sale',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error',
    }, { status: 500 });
  }
}
