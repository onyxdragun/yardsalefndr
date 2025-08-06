import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Use DatabaseService static method
    const favorites = await DatabaseService.getUserFavorites(parseInt(session.user.id));
    
    // Calculate pagination
    const totalCount = favorites.length;
    const totalPages = Math.ceil(totalCount / limit);
    const pagedFavorites = favorites.slice((page - 1) * limit, page * limit);
    
    return NextResponse.json({
      status: 'success',
      data: {
        garageSales: pagedFavorites,
        totalCount,
        page,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { garageSaleId } = body;

    if (!garageSaleId) {
      return NextResponse.json({ error: 'Garage sale ID is required' }, { status: 400 });
    }

    await DatabaseService.addToFavorites(parseInt(session.user.id), garageSaleId);
    
    return NextResponse.json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const garageSaleId = searchParams.get('garageSaleId');

    if (!garageSaleId) {
      return NextResponse.json({ error: 'Garage sale ID is required' }, { status: 400 });
    }

    await DatabaseService.removeFromFavorites(parseInt(session.user.id), parseInt(garageSaleId));
    
    return NextResponse.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
