import { query } from '../config/database.js';

/**
 * Create guest
 * @param {Object} guestData - Guest data
 * @returns {Promise<Object>}
 */
const create = async (guestData) => {
  const sql = `
    INSERT INTO guests (
      first_name, last_name, email, phone, date_of_birth, gender,
      nationality, id_proof_type, id_proof_number, address_line1, city,
      state, country, pincode, loyalty_tier, loyalty_points
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 0)
    RETURNING *
  `;

  const values = [
    guestData.first_name,
    guestData.last_name || null,
    guestData.email,
    guestData.phone,
    guestData.date_of_birth || null,
    guestData.gender || null,
    guestData.nationality || 'Indian',
    guestData.id_proof_type || null,
    guestData.id_proof_number || null,
    guestData.address_line1 || null,
    guestData.city || null,
    guestData.state || null,
    guestData.country || null,
    guestData.pincode || null,
    guestData.loyalty_tier || 'SILVER',
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find guest by ID
 * @param {string} id - Guest ID
 * @returns {Promise<Object>}
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM guests WHERE id = $1';
  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Find guest by email
 * @param {string} email - Guest email
 * @returns {Promise<Object>}
 */
const findByEmail = async (email) => {
  const sql = 'SELECT * FROM guests WHERE email = $1';
  const result = await query(sql, [email]);
  return result.rows[0];
};

/**
 * Find guests by phone
 * @param {string} phone - Guest phone
 * @returns {Promise<Array>}
 */
const findByPhone = async (phone) => {
  const sql = 'SELECT * FROM guests WHERE phone = $1 OR whatsapp_number = $1';
  const result = await query(sql, [phone]);
  return result.rows;
};

/**
 * Search guests
 * @param {string} search - Search query
 * @param {Object} options - Query options
 * @returns {Promise<Object>}
 */
const search = async (search, { limit = 20, offset = 0 } = {}) => {
  const sql = `
    SELECT * FROM guests
    WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const searchTerm = `%${search}%`;
  const result = await query(sql, [searchTerm, limit, offset]);

  const countSql = `
    SELECT COUNT(*) FROM guests
    WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
  `;
  const countResult = await query(countSql, [searchTerm]);

  return {
    guests: result.rows,
    totalCount: parseInt(countResult.rows[0].count),
  };
};

/**
 * Update guest
 * @param {string} id - Guest ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>}
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(updateData).forEach(key => {
    if (!['id', 'created_at'].includes(key)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    return await findById(id);
  }

  fields.push(`updated_at = NOW()`);

  const sql = `
    UPDATE guests
    SET ${fields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  values.push(id);

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Update loyalty points
 * @param {string} id - Guest ID
 * @param {number} points - Points to add
 * @returns {Promise<Object>}
 */
const updateLoyaltyPoints = async (id, points) => {
  const sql = `
    UPDATE guests
    SET loyalty_points = loyalty_points + $1,
        loyalty_points_lifetime = loyalty_points_lifetime + $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *
  `;

  const result = await query(sql, [points, id]);
  return result.rows[0];
};

/**
 * Update guest stay statistics
 * @param {string} id - Guest ID
 * @param {number} nights - Number of nights
 * @param {number} amount - Amount spent
 * @returns {Promise<Object>}
 */
const updateStayStats = async (id, nights, amount) => {
  const sql = `
    UPDATE guests
    SET total_stays = total_stays + 1,
        total_nights = total_nights + $1,
        total_spent = total_spent + $2,
        last_stay_date = CURRENT_DATE,
        average_spend_per_stay = (total_spent + $2) / (total_stays + 1),
        updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `;

  const result = await query(sql, [nights, amount, id]);
  return result.rows[0];
};

/**
 * Get VIP guests
 * @param {number} limit - Number of results
 * @returns {Promise<Array>}
 */
const getVIPGuests = async (limit = 10) => {
  const sql = `
    SELECT * FROM guests
    WHERE vip_level IN ('VIP', 'VVIP', 'CELEBRITY')
    ORDER BY total_spent DESC
    LIMIT $1
  `;

  const result = await query(sql, [limit]);
  return result.rows;
};

/**
 * Get repeat guests
 * @param {number} limit - Number of results
 * @returns {Promise<Array>}
 */
const getRepeatGuests = async (limit = 10) => {
  const sql = `
    SELECT * FROM guests
    WHERE total_stays > 1
    ORDER BY total_stays DESC
    LIMIT $1
  `;

  const result = await query(sql, [limit]);
  return result.rows;
};

export const guestRepository = {
  create,
  findById,
  findByEmail,
  findByPhone,
  search,
  update,
  updateLoyaltyPoints,
  updateStayStats,
  getVIPGuests,
  getRepeatGuests,
};
