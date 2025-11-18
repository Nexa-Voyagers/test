import pg from 'pg';
import dotenv from 'dotenv';
import { logger } from './logger.js';

dotenv.config();

const { Pool } = pg;

/**
 * Database configuration
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  max: parseInt(process.env.DB_POOL_MAX || '10'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

/**
 * Create connection pool
 */
export const pool = new Pool(dbConfig);

/**
 * Pool event handlers
 */
pool.on('connect', () => {
  logger.debug('New client connected to database pool');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client:', err);
  process.exit(-1);
});

/**
 * Test database connection
 * @returns {Promise<boolean>}
 */
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info(`✅ Database connected successfully at ${result.rows[0].now}`);
    client.release();
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Query helper with logging
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('Query error', { text, error: error.message });
    throw error;
  }
};

/**
 * Transaction helper
 * @param {Function} callback - Callback function for transaction
 * @returns {Promise<*>}
 */
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export default pool;
