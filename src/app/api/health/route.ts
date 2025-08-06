// API endpoint for health check and database status
import { NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function GET() {
  try {
    // Test database connection
    const dbHealthy = await DatabaseService.testConnection();
    
    return NextResponse.json({
      status: 'success',
      data: {
        timestamp: new Date().toISOString(),
        application: {
          name: 'YardSaleFndr',
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development',
        },
        database: {
          status: dbHealthy ? 'connected' : 'disconnected',
          healthy: dbHealthy,
        },
        uptime: process.uptime(),
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      data: {
        timestamp: new Date().toISOString(),
        application: {
          name: 'YardSaleFndr',
          version: '1.0.0',
          environment: process.env.NODE_ENV || 'development',
        },
        database: {
          status: 'error',
          healthy: false,
        },
        uptime: process.uptime(),
      },
      error: process.env.NODE_ENV === 'development' ? String(error) : 'Internal server error',
    }, { status: 500 });
  }
}
