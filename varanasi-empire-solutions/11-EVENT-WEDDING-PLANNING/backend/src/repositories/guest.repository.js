import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Repository for event_guests table
 * Handles all database operations for event guest management
 */
class GuestRepository {
  /**
   * Create a new guest
   * @param {Object} guestData - Guest data
   * @returns {Promise<Object>} Created guest
   */
  async create(guestData) {
    const {
      event_id,
      guest_name,
      guest_phone,
      guest_email,
      guest_category,
      invitation_sent,
      rsvp_status,
      number_of_attendees,
      special_requirements,
    } = guestData;

    const query = `
      INSERT INTO event_guests (
        event_id, guest_name, guest_phone, guest_email, guest_category,
        invitation_sent, rsvp_status, number_of_attendees, special_requirements
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      event_id,
      guest_name,
      guest_phone,
      guest_email,
      guest_category,
      invitation_sent || false,
      rsvp_status,
      number_of_attendees || 1,
      special_requirements,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Create multiple guests in bulk
   * @param {Array} guests - Array of guest data
   * @returns {Promise<Array>} Created guests
   */
  async createBulk(guests) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const createdGuests = [];
      for (const guestData of guests) {
        const query = `
          INSERT INTO event_guests (
            event_id, guest_name, guest_phone, guest_email, guest_category,
            invitation_sent, rsvp_status, number_of_attendees, special_requirements
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `;

        const values = [
          guestData.event_id,
          guestData.guest_name,
          guestData.guest_phone,
          guestData.guest_email,
          guestData.guest_category,
          guestData.invitation_sent || false,
          guestData.rsvp_status,
          guestData.number_of_attendees || 1,
          guestData.special_requirements,
        ];

        const result = await client.query(query, values);
        createdGuests.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return createdGuests;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find all guests with filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} List of guests
   */
  async findAll(filters = {}) {
    let query = `
      SELECT
        eg.*,
        e.event_number,
        e.event_name,
        e.event_date
      FROM event_guests eg
      JOIN events e ON eg.event_id = e.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.event_id) {
      query += ` AND eg.event_id = $${paramCount}`;
      values.push(filters.event_id);
      paramCount++;
    }

    if (filters.guest_category) {
      query += ` AND eg.guest_category = $${paramCount}`;
      values.push(filters.guest_category);
      paramCount++;
    }

    if (filters.rsvp_status) {
      query += ` AND eg.rsvp_status = $${paramCount}`;
      values.push(filters.rsvp_status);
      paramCount++;
    }

    if (filters.invitation_sent !== undefined) {
      query += ` AND eg.invitation_sent = $${paramCount}`;
      values.push(filters.invitation_sent);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (
        eg.guest_name ILIKE $${paramCount} OR
        eg.guest_phone ILIKE $${paramCount} OR
        eg.guest_email ILIKE $${paramCount}
      )`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    query += ' ORDER BY eg.guest_name ASC';

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
   * Find guest by ID
   * @param {string} id - Guest ID
   * @returns {Promise<Object>} Guest data
   */
  async findById(id) {
    const query = `
      SELECT
        eg.*,
        e.event_number,
        e.event_name,
        e.event_date
      FROM event_guests eg
      JOIN events e ON eg.event_id = e.id
      WHERE eg.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Guest');
    }

    return result.rows[0];
  }

  /**
   * Find guests by event ID
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} List of guests
   */
  async findByEventId(eventId) {
    const query = `
      SELECT * FROM event_guests
      WHERE event_id = $1
      ORDER BY guest_category, guest_name ASC
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Get guests by RSVP status
   * @param {string} eventId - Event ID
   * @param {string} rsvpStatus - RSVP status
   * @returns {Promise<Array>} List of guests
   */
  async getGuestsByRSVPStatus(eventId, rsvpStatus) {
    const query = `
      SELECT * FROM event_guests
      WHERE event_id = $1 AND rsvp_status = $2
      ORDER BY guest_name ASC
    `;

    const result = await pool.query(query, [eventId, rsvpStatus]);
    return result.rows;
  }

  /**
   * Get guests by category
   * @param {string} eventId - Event ID
   * @param {string} category - Guest category
   * @returns {Promise<Array>} List of guests
   */
  async getGuestsByCategory(eventId, category) {
    const query = `
      SELECT * FROM event_guests
      WHERE event_id = $1 AND guest_category = $2
      ORDER BY guest_name ASC
    `;

    const result = await pool.query(query, [eventId, category]);
    return result.rows;
  }

  /**
   * Get guests who haven't sent invitations
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Guests without invitations
   */
  async getGuestsWithoutInvitations(eventId) {
    const query = `
      SELECT * FROM event_guests
      WHERE event_id = $1 AND invitation_sent = false
      ORDER BY guest_category, guest_name ASC
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Get guests with pending RSVP
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Guests with pending RSVP
   */
  async getGuestsWithPendingRSVP(eventId) {
    const query = `
      SELECT * FROM event_guests
      WHERE event_id = $1
        AND invitation_sent = true
        AND (rsvp_status IS NULL OR rsvp_status = 'PENDING')
      ORDER BY guest_name ASC
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Update guest
   * @param {string} id - Guest ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated guest
   */
  async update(id, updateData) {
    const allowedFields = [
      'guest_name',
      'guest_phone',
      'guest_email',
      'guest_category',
      'invitation_sent',
      'rsvp_status',
      'number_of_attendees',
      'special_requirements',
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
      UPDATE event_guests
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Guest');
    }

    return result.rows[0];
  }

  /**
   * Update RSVP status
   * @param {string} id - Guest ID
   * @param {string} rsvpStatus - RSVP status
   * @returns {Promise<Object>} Updated guest
   */
  async updateRSVPStatus(id, rsvpStatus) {
    const validStatuses = ['PENDING', 'CONFIRMED', 'DECLINED'];

    if (!validStatuses.includes(rsvpStatus)) {
      throw new Error(`Invalid RSVP status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const query = `
      UPDATE event_guests
      SET rsvp_status = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [rsvpStatus, id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Guest');
    }

    return result.rows[0];
  }

  /**
   * Mark invitation as sent
   * @param {string} id - Guest ID
   * @returns {Promise<Object>} Updated guest
   */
  async markInvitationSent(id) {
    const query = `
      UPDATE event_guests
      SET invitation_sent = true
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Guest');
    }

    return result.rows[0];
  }

  /**
   * Mark invitations as sent for multiple guests
   * @param {Array} guestIds - Array of guest IDs
   * @returns {Promise<number>} Number of updated guests
   */
  async markMultipleInvitationsSent(guestIds) {
    const query = `
      UPDATE event_guests
      SET invitation_sent = true
      WHERE id = ANY($1)
      RETURNING id
    `;

    const result = await pool.query(query, [guestIds]);
    return result.rowCount;
  }

  /**
   * Delete guest
   * @param {string} id - Guest ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const query = 'DELETE FROM event_guests WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Guest');
    }

    return true;
  }

  /**
   * Get event guest statistics
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Guest statistics
   */
  async getEventGuestStatistics(eventId) {
    const query = `
      SELECT
        COUNT(*) as total_guests,
        SUM(number_of_attendees) as total_attendees,
        COUNT(CASE WHEN invitation_sent = true THEN 1 END) as invitations_sent,
        COUNT(CASE WHEN invitation_sent = false THEN 1 END) as invitations_pending,
        COUNT(CASE WHEN rsvp_status = 'CONFIRMED' THEN 1 END) as confirmed_guests,
        SUM(CASE WHEN rsvp_status = 'CONFIRMED' THEN number_of_attendees ELSE 0 END) as confirmed_attendees,
        COUNT(CASE WHEN rsvp_status = 'DECLINED' THEN 1 END) as declined_guests,
        COUNT(CASE WHEN rsvp_status = 'PENDING' OR rsvp_status IS NULL THEN 1 END) as pending_rsvp,
        COUNT(CASE WHEN special_requirements IS NOT NULL AND special_requirements != '' THEN 1 END) as guests_with_special_requirements
      FROM event_guests
      WHERE event_id = $1
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows[0] || {
      total_guests: 0,
      total_attendees: 0,
      invitations_sent: 0,
      invitations_pending: 0,
      confirmed_guests: 0,
      confirmed_attendees: 0,
      declined_guests: 0,
      pending_rsvp: 0,
      guests_with_special_requirements: 0,
    };
  }

  /**
   * Get guest statistics by category
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Statistics by category
   */
  async getStatisticsByCategory(eventId) {
    const query = `
      SELECT
        guest_category,
        COUNT(*) as total_guests,
        SUM(number_of_attendees) as total_attendees,
        COUNT(CASE WHEN rsvp_status = 'CONFIRMED' THEN 1 END) as confirmed_guests,
        SUM(CASE WHEN rsvp_status = 'CONFIRMED' THEN number_of_attendees ELSE 0 END) as confirmed_attendees
      FROM event_guests
      WHERE event_id = $1
      GROUP BY guest_category
      ORDER BY guest_category
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Get RSVP response rate
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} RSVP response rate
   */
  async getRSVPResponseRate(eventId) {
    const query = `
      SELECT
        COUNT(*) as total_invited,
        COUNT(CASE WHEN rsvp_status IS NOT NULL AND rsvp_status != 'PENDING' THEN 1 END) as total_responded,
        CASE
          WHEN COUNT(*) > 0 THEN
            ROUND((COUNT(CASE WHEN rsvp_status IS NOT NULL AND rsvp_status != 'PENDING' THEN 1 END)::numeric / COUNT(*)::numeric * 100), 2)
          ELSE 0
        END as response_rate_percentage
      FROM event_guests
      WHERE event_id = $1 AND invitation_sent = true
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows[0] || {
      total_invited: 0,
      total_responded: 0,
      response_rate_percentage: 0,
    };
  }

  /**
   * Get guests with special requirements
   * @param {string} eventId - Event ID
   * @returns {Promise<Array>} Guests with special requirements
   */
  async getGuestsWithSpecialRequirements(eventId) {
    const query = `
      SELECT * FROM event_guests
      WHERE event_id = $1
        AND special_requirements IS NOT NULL
        AND special_requirements != ''
      ORDER BY guest_category, guest_name ASC
    `;

    const result = await pool.query(query, [eventId]);
    return result.rows;
  }

  /**
   * Check if guest exists
   * @param {string} id - Guest ID
   * @returns {Promise<boolean>} Existence status
   */
  async exists(id) {
    const query = 'SELECT 1 FROM event_guests WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  /**
   * Search guests by name or contact
   * @param {string} eventId - Event ID
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching guests
   */
  async searchGuests(eventId, searchTerm) {
    const query = `
      SELECT * FROM event_guests
      WHERE event_id = $1
        AND (
          guest_name ILIKE $2 OR
          guest_phone ILIKE $2 OR
          guest_email ILIKE $2
        )
      ORDER BY guest_name ASC
    `;

    const result = await pool.query(query, [eventId, `%${searchTerm}%`]);
    return result.rows;
  }
}

export default new GuestRepository();
