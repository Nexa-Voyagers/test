import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Client Repository
 * Handles database operations for clients table
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
      client_type,
      first_name,
      last_name,
      company_name,
      phone,
      email,
      address,
    } = clientData;

    const query = `
      INSERT INTO clients (
        client_code, client_type, first_name, last_name,
        company_name, phone, email, address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      client_code,
      client_type,
      first_name,
      last_name,
      company_name,
      phone,
      email,
      address,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find client by ID
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Client object
   */
  async findById(id) {
    const query = 'SELECT * FROM clients WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Find client by code
   * @param {string} code - Client code
   * @returns {Promise<Object>} Client object
   */
  async findByCode(code) {
    const query = 'SELECT * FROM clients WHERE client_code = $1';
    const result = await pool.query(query, [code]);
    return result.rows[0];
  }

  /**
   * Find client by phone
   * @param {string} phone - Client phone number
   * @returns {Promise<Object>} Client object
   */
  async findByPhone(phone) {
    const query = 'SELECT * FROM clients WHERE phone = $1';
    const result = await pool.query(query, [phone]);
    return result.rows[0];
  }

  /**
   * Find all clients with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Clients and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      client_type,
      is_active,
      search,
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (client_type) {
      conditions.push(`client_type = $${paramIndex++}`);
      values.push(client_type);
    }

    if (is_active !== undefined) {
      conditions.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }

    if (search) {
      conditions.push(`(
        first_name ILIKE $${paramIndex} OR
        last_name ILIKE $${paramIndex} OR
        company_name ILIKE $${paramIndex} OR
        phone ILIKE $${paramIndex} OR
        email ILIKE $${paramIndex} OR
        client_code ILIKE $${paramIndex}
      )`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM clients ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT * FROM clients
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      clients: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update client by ID
   * @param {string} id - Client ID
   * @param {Object} clientData - Updated client data
   * @returns {Promise<Object>} Updated client
   */
  async update(id, clientData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'client_type',
      'first_name',
      'last_name',
      'company_name',
      'phone',
      'email',
      'address',
      'is_active',
    ];

    allowedFields.forEach((field) => {
      if (clientData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(clientData[field]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE clients
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Client');
    }

    return result.rows[0];
  }

  /**
   * Delete client by ID (soft delete)
   * @param {string} id - Client ID
   * @returns {Promise<Object>} Deleted client
   */
  async delete(id) {
    const query = `
      UPDATE clients
      SET is_active = false
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Client');
    }

    return result.rows[0];
  }

  /**
   * Get client statistics and case history
   * @param {string} clientId - Client ID
   * @returns {Promise<Object>} Client statistics
   */
  async getClientStatistics(clientId) {
    const query = `
      SELECT
        cl.id,
        cl.client_code,
        cl.client_type,
        cl.first_name,
        cl.last_name,
        cl.company_name,
        COUNT(DISTINCT c.id) as total_cases,
        COUNT(DISTINCT CASE WHEN c.case_status IN ('OPEN', 'IN_PROGRESS') THEN c.id END) as active_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'CLOSED' THEN c.id END) as closed_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'WON' THEN c.id END) as won_cases,
        COUNT(DISTINCT CASE WHEN c.case_status = 'LOST' THEN c.id END) as lost_cases,
        COALESCE(SUM(i.total_amount), 0) as total_billed,
        COALESCE(SUM(CASE WHEN i.payment_status = 'PAID' THEN i.total_amount ELSE 0 END), 0) as total_paid,
        COALESCE(SUM(CASE WHEN i.payment_status IN ('PENDING', 'PARTIAL') THEN i.total_amount ELSE 0 END), 0) as outstanding_amount,
        COUNT(DISTINCT i.id) as total_invoices
      FROM clients cl
      LEFT JOIN cases c ON cl.id = c.client_id
      LEFT JOIN invoices i ON c.id = i.case_id
      WHERE cl.id = $1
      GROUP BY cl.id, cl.client_code, cl.client_type, cl.first_name, cl.last_name, cl.company_name
    `;

    const result = await pool.query(query, [clientId]);
    return result.rows[0] || null;
  }

  /**
   * Search clients by name, company, or phone
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} List of matching clients
   */
  async searchClients(searchTerm) {
    const query = `
      SELECT
        id,
        client_code,
        client_type,
        first_name,
        last_name,
        company_name,
        phone,
        email
      FROM clients
      WHERE
        is_active = true AND (
          first_name ILIKE $1 OR
          last_name ILIKE $1 OR
          company_name ILIKE $1 OR
          phone ILIKE $1 OR
          client_code ILIKE $1
        )
      ORDER BY created_at DESC
      LIMIT 20
    `;

    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  /**
   * Get clients with outstanding payments
   * @returns {Promise<Array>} List of clients with outstanding payments
   */
  async getClientsWithOutstandingPayments() {
    const query = `
      SELECT
        cl.id,
        cl.client_code,
        cl.client_type,
        cl.first_name,
        cl.last_name,
        cl.company_name,
        cl.phone,
        cl.email,
        COUNT(i.id) as outstanding_invoices,
        SUM(i.total_amount) as total_outstanding
      FROM clients cl
      INNER JOIN invoices i ON cl.id = i.client_id
      WHERE i.payment_status IN ('PENDING', 'PARTIAL') AND cl.is_active = true
      GROUP BY cl.id, cl.client_code, cl.client_type, cl.first_name, cl.last_name, cl.company_name, cl.phone, cl.email
      ORDER BY total_outstanding DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }
}

export default new ClientRepository();
