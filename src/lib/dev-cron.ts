// src/lib/dev-cron.ts - Only for development
import { updateExpiredGarageSales } from './cron-jobs';

// Simple interval for development (runs every 5 minutes)
if (process.env.NODE_ENV === 'development') {
  console.log('🕐 Starting development cron job for expired garage sales...');
  
  // Run immediately on startup
  updateExpiredGarageSales();
  
  // Then run every 5 minutes (300000 ms) for testing
  setInterval(() => {
    console.log('🔄 Running development cron job...');
    updateExpiredGarageSales();
  }, 5 * 60 * 1000);
}
