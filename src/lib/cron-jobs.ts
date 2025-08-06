// src/lib/cron-jobs.ts
import { query } from './db-pool';

export async function updateExpiredGarageSales(): Promise<void> {
  try {
    const result = await query(
      `UPDATE garage_sales 
       SET status = 'completed', updated_at = NOW() 
       WHERE status = 'active' AND end_date < CURDATE()`
    );
    
    console.log(`Updated ${result.affectedRows} expired garage sales to completed status`);
  } catch (error) {
    console.error('Error updating expired garage sales:', error);
  }
}

// If using node-cron package
// import cron from 'node-cron';
// 
// // Run daily at 1 AM
// cron.schedule('0 1 * * *', () => {
//   updateExpiredGarageSales();
// });
