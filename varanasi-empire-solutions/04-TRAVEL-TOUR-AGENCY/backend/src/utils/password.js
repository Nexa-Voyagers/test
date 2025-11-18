import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Match result
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export default {
  hashPassword,
  comparePassword,
};
