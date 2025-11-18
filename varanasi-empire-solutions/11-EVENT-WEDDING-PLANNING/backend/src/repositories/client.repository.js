import { pool } from '../config/database.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Repository for clients table
 * Handles all database operations for client management
 */
class ClientRepository {
  /**
   * Create a new client
   * @param {Object} clientData - Client data
   * @returns {Promise<Object>} Created client
   */
  async create(clientData) {
    const {
      client_code,
      first_name,
      last_name,
      phone,
      email,
      address,
      city,
      budget_min,
      budget_max,
    } = clientData;

    // Check if client_code already exists
    const existingClient = await this.findByClientCode(client_code);
    if (existingClient) {
      throw new ConflictError('Client code already exists');
    }

    const query = `
      INSERT INTO clients (
        client_code, first_name, last_name, phone, email,
        address, city, budget_min, budget_max
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      client_code,
      first_name,
      last_name,
      phone,
      email,
      address,
      city,
      budget_min,
      budget_max,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all clients with optional filters and search
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of clients
   */
  async findAll(filters = {}) {
    let query = 'SELECT * FROM clients WHERE 1=1';
    const values = [];
    let paramCount = 1;

    // Search by name or phone
    if (filters.search) {
      query += ` AND (
        first_name ILIKE $${paramCount} OR
        last_name ILIKE $${paramCount} OR
        phone ILIKE $${paramCount} OR
        client_code ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters.city) {
      query += ` AND city ILIKE $${paramCount}`;
      values.push(`%${filters.city}%`);
      paramCount++;
    }

    if (filters.budget_min) {
      query += ` AND budget_max >= $${paramCount}`;
      values.push(filters.budget_min);
      paramCount++;
    }

    if (filters.budget_max) {
      query += ` AND budget_min <= $${paramCount}`;
      values.push(filters.budget_max);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find client by ID
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client data
   */
  async findById(id) {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Client');
    }

    return result.rows[0];
  }

  /**
   * Find client by client code
   * @param {string} clientCode - Client code
   * @returns {Promise<Object|null>} Client data or null
   */
  async findByClientCode(clientCode) {
    const query = 'SELECT * FROM clients WHERE client_code = $1';
    const result = await pool.query(query, [clientCode]);
    return result.rows[0] || null;
  }

  /**
   * Find clients by phone number
   * @param {string} phone - Phone number
   * @returns {Promise<Array>} List of clients
   */
  async findByPhone(phone) {
    const query = 'SELECT * FROM clients WHERE phone ILIKE $1';
    const result = await pool.query(query, [`%${phone}%`]);
    return result.rows;
  }

  /**
   * Update client
   * @param {string} id - Client ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated client
   */
  async update(id, updateData) {
    const allowedFields = [
      'first_name',
      'last_name',
      'phone',
      'email',
      'address',
      'city',
      'budget_min',
      'budget_max',
    ];

    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);
    const query = `
      UPDATE clients
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Client');
    }

    return result.rows[0];
  }

  /**
   * Delete client
   * @param {string} id - Client ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    // Check if client has any events
    const eventCheck = await pool.query(
      'SELECT COUNT(*) FROM events WHERE client_id = $1',
      [id]
    );

    if (parseInt(eventCheck.rows[0].count) > 0) {
      throw new ConflictError('Cannot delete client with existing events');
    }

    const query = 'DELETE FROM clients WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Client');
    }

    return true;
  }

  /**
   * Get client with event history
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client with events
   */
  async findByIdWithEvents(id) {
    const query = `
      SELECT
        c.*,
        json_agg(
          json_build_object(
            'id', e.id,
            'event_number', e.event_number,
            'event_name', e.event_name,
            'event_type', e.event_type,
            'event_date', e.event_date,
            'event_status', e.event_status,
            'total_budget', e.total_budget,
            'actual_cost', e.actual_cost
          ) ORDER BY e.event_date DESC
        ) FILTER (WHERE e.id IS NOT NULL) as events
      FROM clients c
      LEFT JOIN events e ON c.id = e.client_id
      WHERE c.id = $1
      GROUP BY c.id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Client');
    }

    return result.rows[0];
  }

  /**
   * Get client statistics
   * @param {string} clientId - Client ID
   * @returns {Promise<Object>} Client statistics
   */
  async getStatistics(clientId) {
    const query = `
      SELECT
        COUNT(e.id) as total_events,
        COUNT(CASE WHEN e.event_status = 'COMPLETED' THEN 1 END) as completed_events,
        COUNT(CASE WHEN e.event_status = 'IN_PROGRESS' THEN 1 END) as ongoing_events,
        COALESCE(SUM(e.total_budget), 0) as total_spent,
        COALESCE(AVG(e.actual_cost), 0) as average_event_cost
      FROM clients c
      LEFT JOIN events e ON c.id = e.client_id
      WHERE c.id = $1
      GROUP BY c.id
    `;

    const result = await pool.query(query, [clientId]);
    return result.rows[0] || {
      total_events: 0,
      completed_events: 0,
      ongoing_events: 0,
      total_spent: 0,
      average_event_cost: 0,
    };
  }

  /**
   * Generate unique client code
   * @returns {Promise<string>} Generated client code
   */
  async generateClientCode() {
    const prefix = 'CLT';
    const query = `
      SELECT client_code
      FROM clients
      WHERE client_code LIKE $1
      ORDER BY client_code DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [`${prefix}%`]);

    if (result.rows.length === 0) {
      return `${prefix}0001`;
    }

    const lastCode = result.rows[0].client_code;
    const lastNumber = parseInt(lastCode.replace(prefix, ''));
    const newNumber = (lastNumber + 1).toString().padStart(4, '0');

    return `${prefix}${newNumber}`;
  }

  /**
   * Check if client exists
   * @param {string} id - Client ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM clients WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }
}

export default new ClientRepository();
