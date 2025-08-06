// Database connection pool configuration
import mariadb from 'mariadb';

export type { PoolConnection as Connection } from 'mariadb';

// Define global type for pool caching
const globalForDb = global as unknown as { pool?: mariadb.Pool };

// Create connection pool
export const pool = globalForDb.pool ||
  mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'garagesale_db',
    port: Number(process.env.DB_PORT) || 3306,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    charset: 'utf8mb4',
    timezone: 'Z',
  });

// Cache pool in development to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') globalForDb.pool = pool;

export async function getConnection(): Promise<mariadb.PoolConnection> {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

// Simple utility functions
export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const connection = await getConnection();
  try {
    const rows = await connection.execute(sql, params);
    return rows as T;
  } finally {
    connection.release();
  }
}

export async function transaction<T>(
  callback: (connection: mariadb.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
