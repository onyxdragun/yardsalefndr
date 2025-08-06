import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { DatabaseService } from '@/lib/database';

// GET /api/garage-sales/[id] - Get a specific garage sale
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid garage sale ID' },
        { status: 400 }
      );
    }

    const garageSale = await DatabaseService.getGarageSaleById(id);
    
    if (!garageSale) {
      return NextResponse.json(
        { error: 'Garage sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: garageSale
    });
  } catch (error) {
    console.error('Error fetching garage sale:', error);
    return NextResponse.json(
      { error: 'Failed to fetch garage sale' },
      { status: 500 }
    );
  }
}

// PUT /api/garage-sales/[id] - Update a garage sale
export async function PUT(
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
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid garage sale ID' },
        { status: 400 }
      );
    }

    // Check if the garage sale exists and belongs to the user
    const existingGarageSale = await DatabaseService.getGarageSaleById(id);
    
    if (!existingGarageSale) {
      return NextResponse.json(
        { error: 'Garage sale not found' },
        { status: 404 }
      );
    }

    if (existingGarageSale.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'You can only edit your own garage sales' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.address || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the garage sale
    await DatabaseService.updateGarageSale(id, {
      ...body,
      userId: parseInt(session.user.id)
    });

    // Update categories if provided
    if (body.categories && Array.isArray(body.categories)) {
      await DatabaseService.updateGarageSaleCategories(id, body.categories);
    }

    // Fetch the updated garage sale with categories
    const finalGarageSale = await DatabaseService.getGarageSaleById(id);

    return NextResponse.json({
      status: 'success',
      data: finalGarageSale
    });
  } catch (error) {
    console.error('Error updating garage sale:', error);
    return NextResponse.json(
      { error: 'Failed to update garage sale' },
      { status: 500 }
    );
  }
}

// DELETE /api/garage-sales/[id] - Delete a garage sale
export async function DELETE(
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
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid garage sale ID' },
        { status: 400 }
      );
    }

    // Check if the garage sale exists and belongs to the user
    const existingGarageSale = await DatabaseService.getGarageSaleById(id);
    
    if (!existingGarageSale) {
      return NextResponse.json(
        { error: 'Garage sale not found' },
        { status: 404 }
      );
    }

    if (existingGarageSale.userId !== parseInt(session.user.id)) {
      return NextResponse.json(
        { error: 'You can only delete your own garage sales' },
        { status: 403 }
      );
    }

    // Delete the garage sale
    await DatabaseService.deleteGarageSale(id);

    return NextResponse.json({
      status: 'success',
      message: 'Garage sale deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting garage sale:', error);
    return NextResponse.json(
      { error: 'Failed to delete garage sale' },
      { status: 500 }
    );
  }
}
