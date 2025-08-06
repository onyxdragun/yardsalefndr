// src/app/api/admin/update-expired-sales/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-pool';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add API key authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `UPDATE garage_sales 
       SET status = 'completed', updated_at = NOW() 
       WHERE status = 'active' AND end_date < CURDATE()`
    );
    
    // Log the operation for monitoring
    console.log(`[${new Date().toISOString()}] Cron job: Updated ${result.affectedRows} expired garage sales to completed status`);
    
    return NextResponse.json({
      success: true,
      message: `Updated ${result.affectedRows} expired garage sales`,
      updatedCount: result.affectedRows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating expired garage sales:', error);
    return NextResponse.json(
      { error: 'Failed to update expired sales' },
      { status: 500 }
    );
  }
}
