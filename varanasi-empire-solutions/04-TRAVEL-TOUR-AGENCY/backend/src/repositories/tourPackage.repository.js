import { query } from '../config/database.js';

const create = async (packageData) => {
  const result = await query(
    `INSERT INTO tour_packages (
      package_code, agency_id, package_name, package_type, destination,
      duration_days, duration_nights, price_per_person, max_group_size,
      description, inclusions, exclusions, is_active, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`,
    [
      packageData.package_code,
      packageData.agency_id,
      packageData.package_name,
      packageData.package_type,
      packageData.destination,
      packageData.duration_days,
      packageData.duration_nights,
      packageData.price_per_person,
      packageData.max_group_size,
      packageData.description,
      packageData.inclusions,
      packageData.exclusions,
      packageData.is_active || true,
      packageData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    'SELECT * FROM tour_packages WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const findByAgency = async (agencyId, filters = {}) => {
  let queryText = `
    SELECT * FROM tour_packages
    WHERE agency_id = $1
  `;
  const values = [agencyId];
  let paramCount = 2;

  if (filters.package_type) {
    queryText += ` AND package_type = $${paramCount}`;
    values.push(filters.package_type);
    paramCount++;
  }

  if (filters.is_active !== undefined) {
    queryText += ` AND is_active = $${paramCount}`;
    values.push(filters.is_active);
    paramCount++;
  }

  queryText += ' ORDER BY created_at DESC';

  const result = await query(queryText, values);
  return result.rows;
};

const search = async (searchTerm, agencyId) => {
  const result = await query(
    `SELECT * FROM tour_packages
     WHERE agency_id = $1
     AND (
       package_name ILIKE $2
       OR destination ILIKE $2
       OR package_type ILIKE $2
     )
     AND is_active = true
     ORDER BY package_name
     LIMIT 20`,
    [agencyId, `%${searchTerm}%`]
  );
  return result.rows;
};

const update = async (id, packageData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(packageData).forEach((key) => {
    if (packageData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(packageData[key]);
      paramCount++;
    }
  });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await query(
    `UPDATE tour_packages SET ${fields.join(', ')}
     WHERE id = $${paramCount}
     RETURNING *`,
    values
  );

  return result.rows[0];
};

const getPopularPackages = async (agencyId, limit = 10) => {
  const result = await query(
    `SELECT tp.*, COUNT(tb.id) as total_bookings
     FROM tour_packages tp
     LEFT JOIN tour_bookings tb ON tp.id = tb.package_id
     WHERE tp.agency_id = $1 AND tp.is_active = true
     GROUP BY tp.id
     ORDER BY total_bookings DESC
     LIMIT $2`,
    [agencyId, limit]
  );
  return result.rows;
};

export const tourPackageRepository = {
  create,
  findById,
  findByAgency,
  search,
  update,
  getPopularPackages,
};

export default tourPackageRepository;
