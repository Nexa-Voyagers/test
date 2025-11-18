import { pool, transaction } from '../config/database.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Repository for events table
 * Handles all database operations for event management
 */
class EventRepository {
  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Created event
   */
  async create(eventData) {
    const {
      company_id,
      client_id,
      event_number,
      event_name,
      event_type,
      event_date,
      event_time,
      expected_guests,
      bride_name,
      groom_name,
      wedding_date,
      mehendi_date,
      sangeet_date,
      reception_date,
      venue_name,
      venue_address,
      venue_city,
      venue_capacity,
      total_budget,
      estimated_cost,
      event_status,
    } = eventData;

    // Check if event_number already exists
    const existingEvent = await this.findByEventNumber(event_number);
    if (existingEvent) {
      throw new ConflictError('Event number already exists');
    }

    const query = `
      INSERT INTO events (
        company_id, client_id, event_number, event_name, event_type,
        event_date, event_time, expected_guests,
        bride_name, groom_name, wedding_date, mehendi_date, sangeet_date, reception_date,
        venue_name, venue_address, venue_city, venue_capacity,
        total_budget, estimated_cost, event_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `;

    const values = [
      company_id,
      client_id,
      event_number,
      event_name,
      event_type,
      event_date,
      event_time,
      expected_guests,
      bride_name,
      groom_name,
      wedding_date,
      mehendi_date,
      sangeet_date,
      reception_date,
      venue_name,
      venue_address,
      venue_city,
      venue_capacity,
      total_budget,
      estimated_cost,
      event_status || 'PLANNING',
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find all events with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of events
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        e.*,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name,
        c.phone as client_phone,
        ec.company_name
      FROM events e
      LEFT JOIN clients c ON e.client_id = c.id
      LEFT JOIN event_companies ec ON e.company_id = ec.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.company_id) {
      query += ` AND e.company_id = $${paramCount}`;
      values.push(filters.company_id);
      paramCount++;
    }

    if (filters.client_id) {
      query += ` AND e.client_id = $${paramCount}`;
      values.push(filters.client_id);
      paramCount++;
    }

    if (filters.event_type) {
      query += ` AND e.event_type = $${paramCount}`;
      values.push(filters.event_type);
      paramCount++;
    }

    if (filters.event_status) {
      query += ` AND e.event_status = $${paramCount}`;
      values.push(filters.event_status);
      paramCount++;
    }

    if (filters.venue_city) {
      query += ` AND e.venue_city ILIKE $${paramCount}`;
      values.push(`%${filters.venue_city}%`);
      paramCount++;
    }

    if (filters.date_from) {
      query += ` AND e.event_date >= $${paramCount}`;
      values.push(filters.date_from);
      paramCount++;
    }

    if (filters.date_to) {
      query += ` AND e.event_date <= $${paramCount}`;
      values.push(filters.date_to);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (
        e.event_name ILIKE $${paramCount} OR
        e.event_number ILIKE $${paramCount} OR
        c.first_name ILIKE $${paramCount} OR
        c.last_name ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY e.event_date DESC';

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
   * Find event by ID with related data
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Event data with relationships
   */
  async findById(id) {
    const query = `
      SELECT
        e.*,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name,
        c.phone as client_phone,
        c.email as client_email,
        ec.company_name,
        (
          SELECT COUNT(*)
          FROM event_vendors ev
          WHERE ev.event_id = e.id
        ) as vendor_count,
        (
          SELECT COUNT(*)
          FROM event_tasks et
          WHERE et.event_id = e.id
        ) as task_count,
        (
          SELECT COUNT(*)
          FROM event_tasks et
          WHERE et.event_id = e.id AND et.task_status = 'COMPLETED'
        ) as completed_tasks,
        (
          SELECT COUNT(*)
          FROM event_guests eg
          WHERE eg.event_id = e.id
        ) as guest_count,
        (
          SELECT COUNT(*)
          FROM event_guests eg
          WHERE eg.event_id = e.id AND eg.rsvp_status = 'CONFIRMED'
        ) as confirmed_guests
      FROM events e
      LEFT JOIN clients c ON e.client_id = c.id
      LEFT JOIN event_companies ec ON e.company_id = ec.id
      WHERE e.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event');
    }

    return result.rows[0];
  }

  /**
   * Find event by event number
   * @param {string} eventNumber - Event number
   * @returns {Promise<Object|null>} Event data or null
   */
  async findByEventNumber(eventNumber) {
    const query = 'SELECT * FROM events WHERE event_number = $1';
    const result = await pool.query(query, [eventNumber]);
    return result.rows[0] || null;
  }

  /**
   * Update event
   * @param {string} id - Event ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated event
   */
  async update(id, updateData) {
    const allowedFields = [
      'event_name',
      'event_type',
      'event_date',
      'event_time',
      'expected_guests',
      'bride_name',
      'groom_name',
      'wedding_date',
      'mehendi_date',
      'sangeet_date',
      'reception_date',
      'venue_name',
      'venue_address',
      'venue_city',
      'venue_capacity',
      'total_budget',
      'estimated_cost',
      'actual_cost',
      'event_status',
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
      UPDATE events
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event');
    }

    return result.rows[0];
  }

  /**
   * Update event status
   * @param {string} id - Event ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated event
   */
  async updateStatus(id, status) {
    const validStatuses = ['PLANNING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const query = `
      UPDATE events
      SET event_status = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event');
    }

    return result.rows[0];
  }

  /**
   * Calculate and update actual cost from vendor bookings
   * @param {string} eventId - Event ID
   * @returns {Promise<number>} Updated actual cost
   */
  async updateActualCost(eventId) {
    const query = `
      WITH vendor_costs AS (
        SELECT COALESCE(SUM(final_price), 0) as total
        FROM event_vendors
        WHERE event_id = $1
      )
      UPDATE events
      SET actual_cost = (SELECT total FROM vendor_costs)
      WHERE id = $1
      RETURNING actual_cost
    `;

    const result = await pool.query(query, [eventId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event');
    }

    return result.rows[0].actual_cost;
  }

  /**
   * Get event budget summary
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Budget summary
   */
  async getBudgetSummary(eventId) {
    const query = `
      SELECT
        e.total_budget,
        e.estimated_cost,
        e.actual_cost,
        COALESCE(SUM(ev.final_price), 0) as total_vendor_cost,
        COALESCE(SUM(ev.advance_paid), 0) as total_advance_paid,
        COALESCE(SUM(ev.balance_amount), 0) as total_balance,
        (e.total_budget - COALESCE(e.actual_cost, 0)) as remaining_budget,
        CASE
          WHEN e.total_budget > 0 THEN
            ROUND((COALESCE(e.actual_cost, 0) / e.total_budget * 100)::numeric, 2)
          ELSE 0
        END as budget_utilization_percentage
      FROM events e
      LEFT JOIN event_vendors ev ON e.id = ev.event_id
      WHERE e.id = $1
      GROUP BY e.id, e.total_budget, e.estimated_cost, e.actual_cost
    `;

    const result = await pool.query(query, [eventId]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Event');
    }

    return result.rows[0];
  }

  /**
   * Get events with budget alerts (actual > estimated)
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Events exceeding budget
   */
  async getEventsWithBudgetAlerts(companyId = null) {
    let query = `
      SELECT
        e.*,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name,
        (e.actual_cost - e.estimated_cost) as budget_overrun,
        ROUND(((e.actual_cost - e.estimated_cost) / e.estimated_cost * 100)::numeric, 2) as overrun_percentage
      FROM events e
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE e.actual_cost > e.estimated_cost
    `;

    const values = [];
    if (companyId) {
      query += ' AND e.company_id = $1';
      values.push(companyId);
    }

    query += ' ORDER BY overrun_percentage DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get upcoming events
   * @param {number} days - Number of days to look ahead
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Array>} Upcoming events
   */
  async getUpcomingEvents(days = 30, companyId = null) {
    let query = `
      SELECT
        e.*,
        c.first_name || ' ' || COALESCE(c.last_name, '') as client_name,
        c.phone as client_phone
      FROM events e
      LEFT JOIN clients c ON e.client_id = c.id
      WHERE e.event_date >= CURRENT_DATE
        AND e.event_date <= CURRENT_DATE + $1
        AND e.event_status NOT IN ('CANCELLED', 'COMPLETED')
    `;

    const values = [days];
    if (companyId) {
      query += ' AND e.company_id = $2';
      values.push(companyId);
    }

    query += ' ORDER BY e.event_date ASC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Delete event
   * @param {string} id - Event ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    return transaction(async (client) => {
      // Delete related records first
      await client.query('DELETE FROM event_guests WHERE event_id = $1', [id]);
      await client.query('DELETE FROM event_tasks WHERE event_id = $1', [id]);
      await client.query('DELETE FROM event_vendors WHERE event_id = $1', [id]);
      await client.query('DELETE FROM event_payments WHERE event_id = $1', [id]);

      // Delete event
      const result = await client.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);

      if (result.rows.length === 0) {
        throw new NotFoundError('Event');
      }

      return true;
    });
  }

  /**
   * Generate unique event number
   * @param {string} prefix - Prefix for event number
   * @returns {Promise<string>} Generated event number
   */
  async generateEventNumber(prefix = 'EVT') {
    const query = `
      SELECT event_number
      FROM events
      WHERE event_number LIKE $1
      ORDER BY event_number DESC
      LIMIT 1
    `;

    const result = await pool.query(query, [`${prefix}%`]);

    if (result.rows.length === 0) {
      return `${prefix}0001`;
    }

    const lastNumber = result.rows[0].event_number;
    const numericPart = parseInt(lastNumber.replace(prefix, ''));
    const newNumber = (numericPart + 1).toString().padStart(4, '0');

    return `${prefix}${newNumber}`;
  }

  /**
   * Check if event exists
   * @param {string} id - Event ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM events WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Get event statistics by status
   * @param {string} companyId - Company ID (optional)
   * @returns {Promise<Object>} Status statistics
   */
  async getStatusStatistics(companyId = null) {
    let query = `
      SELECT
        event_status,
        COUNT(*) as count,
        COALESCE(SUM(total_budget), 0) as total_budget,
        COALESCE(SUM(actual_cost), 0) as total_cost
      FROM events
    `;

    const values = [];
    if (companyId) {
      query += ' WHERE company_id = $1';
      values.push(companyId);
    }

    query += ' GROUP BY event_status ORDER BY count DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default new EventRepository();
