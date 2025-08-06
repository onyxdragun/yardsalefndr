// API endpoint for categories
import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET /api/categories - Get all active categories
export async function GET() {
  try {
    const categories = await DatabaseService.getCategories();
    
    return NextResponse.json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch categories',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal server error',
    }, { status: 500 });
  }
}
