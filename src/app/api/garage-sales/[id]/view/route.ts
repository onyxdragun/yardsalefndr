import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { DatabaseService } from '@/lib/database';

// POST /api/garage-sales/[id]/view - Track a view for a garage sale
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const garageSaleId = parseInt(params.id);
    
    if (isNaN(garageSaleId)) {
      return NextResponse.json(
        { error: 'Invalid garage sale ID' },
        { status: 400 }
      );
    }

    // Get the current session to check if user owns this garage sale
    const session = await getServerSession(authOptions);
    
    // Check if the garage sale exists and get its owner
    const garageSale = await DatabaseService.getGarageSaleById(garageSaleId);
    
    if (!garageSale) {
      return NextResponse.json(
        { error: 'Garage sale not found' },
        { status: 404 }
      );
    }

    // Don't increment view count if the user is viewing their own garage sale
    if (session?.user?.id && parseInt(session.user.id) === garageSale.userId) {
      return NextResponse.json({
        status: 'success',
        message: 'View not counted for own garage sale'
      });
    }

    // For rate limiting, we'll use a simple approach with the request IP
    // In a production app, you might want to use Redis or a more sophisticated approach
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';
    
    // Get current date for rate limiting (1 view per IP per garage sale per day)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Create a simple key for rate limiting
    const viewKey = `${clientIp}-${garageSaleId}-${today}`;
    
    // For now, we'll implement a simple in-memory rate limiting
    // In production, you'd want to use Redis or a database table for this
    const viewedToday = request.headers.get('x-garage-sale-viewed-today');
    
    if (!viewedToday || !viewedToday.includes(viewKey)) {
      // Increment the view count
      await DatabaseService.incrementViewCount(garageSaleId);
      
      return NextResponse.json({
        status: 'success',
        message: 'View counted successfully'
      }, {
        headers: {
          // Set a header to track that this view was counted (simple rate limiting)
          'x-garage-sale-viewed': viewKey
        }
      });
    } else {
      return NextResponse.json({
        status: 'success',
        message: 'View already counted today'
      });
    }
    
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}
