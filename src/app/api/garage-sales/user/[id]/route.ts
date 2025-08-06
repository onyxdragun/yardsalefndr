import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { DatabaseService } from '@/lib/database';

// GET /api/garage-sales/user/[id] - Get garage sales for a specific user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Ensure users can only fetch their own garage sales
    if (userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'You can only view your own garage sales' },
        { status: 403 }
      );
    }

    const garageSales = await DatabaseService.getUserGarageSales(userId);

    return NextResponse.json({
      status: 'success',
      data: garageSales
    });
  } catch (error) {
    console.error('Error fetching user garage sales:', error);
    return NextResponse.json(
      { error: 'Failed to fetch garage sales' },
      { status: 500 }
    );
  }
}
