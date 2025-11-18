import { query } from '../config/database.js';

/**
 * Create property
 */
const create = async (propertyData) => {
  const sql = `
    INSERT INTO properties (
      agency_id, owner_id, property_title, property_type, transaction_type,
      bhk_type, built_up_area, carpet_area, plot_area, facing_direction,
      floor_number, total_floors, furnishing_status, parking_spaces,
      address_line1, address_line2, locality, city, state, pincode,
      latitude, longitude, price, price_per_sqft, negotiable,
      maintenance_charge, booking_amount, possession_status, possession_date,
      age_of_property, total_units, rera_registered, rera_id,
      amenities, description, property_features, nearby_facilities,
      status, is_featured, created_by
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
      $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40
    )
    RETURNING id, property_title, property_type, transaction_type, price, status, created_at
  `;

  const values = [
    propertyData.agency_id,
    propertyData.owner_id || null,
    propertyData.property_title,
    propertyData.property_type,
    propertyData.transaction_type,
    propertyData.bhk_type || null,
    propertyData.built_up_area || null,
    propertyData.carpet_area || null,
    propertyData.plot_area || null,
    propertyData.facing_direction || null,
    propertyData.floor_number || null,
    propertyData.total_floors || null,
    propertyData.furnishing_status || 'UNFURNISHED',
    propertyData.parking_spaces || 0,
    propertyData.address_line1,
    propertyData.address_line2 || null,
    propertyData.locality,
    propertyData.city,
    propertyData.state,
    propertyData.pincode,
    propertyData.latitude || null,
    propertyData.longitude || null,
    propertyData.price,
    propertyData.price_per_sqft || null,
    propertyData.negotiable || false,
    propertyData.maintenance_charge || null,
    propertyData.booking_amount || null,
    propertyData.possession_status || 'READY_TO_MOVE',
    propertyData.possession_date || null,
    propertyData.age_of_property || null,
    propertyData.total_units || null,
    propertyData.rera_registered || false,
    propertyData.rera_id || null,
    JSON.stringify(propertyData.amenities || []),
    propertyData.description || null,
    JSON.stringify(propertyData.property_features || {}),
    JSON.stringify(propertyData.nearby_facilities || []),
    propertyData.status || 'AVAILABLE',
    propertyData.is_featured || false,
    propertyData.created_by,
  ];

  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Find property by ID with full details
 */
const findById = async (id) => {
  const sql = `
    SELECT
      p.*,
      o.owner_name, o.phone as owner_phone, o.email as owner_email,
      a.agency_name,
      (SELECT json_agg(json_build_object(
        'url', image_url,
        'caption', caption,
        'is_primary', is_primary
      )) FROM property_images WHERE property_id = p.id) as images
    FROM properties p
    LEFT JOIN owners o ON p.owner_id = o.id
    LEFT JOIN agencies a ON p.agency_id = a.id
    WHERE p.id = $1 AND p.deleted_at IS NULL
  `;

  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

/**
 * Find properties with filters and pagination
 */
const findAll = async (filters = {}) => {
  let sql = `
    SELECT
      p.id, p.property_title, p.property_type, p.transaction_type,
      p.bhk_type, p.built_up_area, p.carpet_area, p.price, p.price_per_sqft,
      p.locality, p.city, p.state, p.status, p.is_featured,
      p.possession_status, p.rera_registered, p.created_at,
      a.agency_name,
      (SELECT image_url FROM property_images WHERE property_id = p.id AND is_primary = true LIMIT 1) as primary_image
    FROM properties p
    LEFT JOIN agencies a ON p.agency_id = a.id
    WHERE p.deleted_at IS NULL
  `;

  const values = [];
  let paramCount = 1;

  if (filters.agency_id) {
    sql += ` AND p.agency_id = $${paramCount}`;
    values.push(filters.agency_id);
    paramCount++;
  }

  if (filters.property_type) {
    sql += ` AND p.property_type = $${paramCount}`;
    values.push(filters.property_type);
    paramCount++;
  }

  if (filters.transaction_type) {
    sql += ` AND p.transaction_type = $${paramCount}`;
    values.push(filters.transaction_type);
    paramCount++;
  }

  if (filters.city) {
    sql += ` AND LOWER(p.city) = LOWER($${paramCount})`;
    values.push(filters.city);
    paramCount++;
  }

  if (filters.bhk_type) {
    sql += ` AND p.bhk_type = $${paramCount}`;
    values.push(filters.bhk_type);
    paramCount++;
  }

  if (filters.min_price) {
    sql += ` AND p.price >= $${paramCount}`;
    values.push(filters.min_price);
    paramCount++;
  }

  if (filters.max_price) {
    sql += ` AND p.price <= $${paramCount}`;
    values.push(filters.max_price);
    paramCount++;
  }

  if (filters.status) {
    sql += ` AND p.status = $${paramCount}`;
    values.push(filters.status);
    paramCount++;
  }

  if (filters.is_featured !== undefined) {
    sql += ` AND p.is_featured = $${paramCount}`;
    values.push(filters.is_featured);
    paramCount++;
  }

  // Count total
  const countSql = sql.replace(/SELECT.*FROM/, 'SELECT COUNT(*) FROM').replace(/LEFT JOIN.*$/s, '');
  const countResult = await query(countSql, values);
  const totalCount = parseInt(countResult.rows[0].count);

  // Add sorting and pagination
  sql += ` ORDER BY p.${filters.sortBy || 'created_at'} ${filters.sortOrder || 'DESC'}`;
  sql += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(filters.limit || 20, filters.offset || 0);

  const result = await query(sql, values);

  return {
    properties: result.rows,
    totalCount,
    page: Math.ceil((filters.offset || 0) / (filters.limit || 20)) + 1,
    limit: filters.limit || 20,
  };
};

/**
 * Update property
 */
const update = async (id, updateData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  const allowedFields = [
    'property_title', 'property_type', 'transaction_type', 'bhk_type',
    'built_up_area', 'carpet_area', 'plot_area', 'facing_direction',
    'floor_number', 'total_floors', 'furnishing_status', 'parking_spaces',
    'address_line1', 'address_line2', 'locality', 'city', 'state', 'pincode',
    'price', 'price_per_sqft', 'negotiable', 'maintenance_charge',
    'booking_amount', 'possession_status', 'possession_date',
    'amenities', 'description', 'property_features', 'status', 'is_featured'
  ];

  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) return await findById(id);

  fields.push('updated_at = NOW()');

  const sql = `
    UPDATE properties
    SET ${fields.join(', ')}
    WHERE id = $${paramCount} AND deleted_at IS NULL
    RETURNING id, property_title, status, updated_at
  `;

  values.push(id);
  const result = await query(sql, values);
  return result.rows[0];
};

/**
 * Soft delete property
 */
const softDelete = async (id) => {
  const sql = `
    UPDATE properties
    SET deleted_at = NOW(), status = 'INACTIVE'
    WHERE id = $1 AND deleted_at IS NULL
    RETURNING id
  `;

  const result = await query(sql, [id]);
  return result.rows[0];
};

/**
 * Update property status
 */
const updateStatus = async (id, status) => {
  const sql = `
    UPDATE properties
    SET status = $1, updated_at = NOW()
    WHERE id = $2 AND deleted_at IS NULL
    RETURNING id, property_title, status
  `;

  const result = await query(sql, [status, id]);
  return result.rows[0];
};

/**
 * Add property image
 */
const addImage = async (propertyId, imageData) => {
  const sql = `
    INSERT INTO property_images (property_id, image_url, caption, is_primary)
    VALUES ($1, $2, $3, $4)
    RETURNING id, image_url, is_primary
  `;

  const result = await query(sql, [
    propertyId,
    imageData.image_url,
    imageData.caption || null,
    imageData.is_primary || false,
  ]);

  return result.rows[0];
};

/**
 * Get property statistics
 */
const getStatistics = async (agencyId) => {
  const sql = `
    SELECT
      COUNT(*) as total_properties,
      COUNT(*) FILTER (WHERE status = 'AVAILABLE') as available_properties,
      COUNT(*) FILTER (WHERE status = 'SOLD') as sold_properties,
      COUNT(*) FILTER (WHERE status = 'RENTED') as rented_properties,
      COUNT(*) FILTER (WHERE transaction_type = 'SALE') as for_sale,
      COUNT(*) FILTER (WHERE transaction_type = 'RENT') as for_rent,
      COALESCE(SUM(price) FILTER (WHERE status = 'AVAILABLE'), 0) as total_inventory_value
    FROM properties
    WHERE agency_id = $1 AND deleted_at IS NULL
  `;

  const result = await query(sql, [agencyId]);
  return result.rows[0];
};

export const propertyRepository = {
  create,
  findById,
  findAll,
  update,
  softDelete,
  updateStatus,
  addImage,
  getStatistics,
};
