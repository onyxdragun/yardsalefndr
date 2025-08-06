import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { DatabaseService } from '@/lib/database';

// GET /api/user/usage-check - Check user's current usage against their limits
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);
    const usageCheck = await DatabaseService.checkUserSalesLimit(userId);

    return NextResponse.json({
      status: 'success',
      data: usageCheck
    });
  } catch (error) {
    console.error('Error checking user usage:', error);
    return NextResponse.json(
      { error: 'Failed to check usage limits' },
      { status: 500 }
    );
  }
}
