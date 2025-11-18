import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Document Repository
 * Handles database operations for documents table
 */
class DocumentRepository {
  /**
   * Create a new document
   * @param {Object} documentData - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(documentData) {
    const {
      case_id,
      document_name,
      document_type,
      document_url,
    } = documentData;

    const query = `
      INSERT INTO documents (
        case_id, document_name, document_type, document_url
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [case_id, document_name, document_type, document_url];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Find document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Document object
   */
  async findById(id) {
    const query = `
      SELECT
        d.*,
        c.case_number,
        c.case_title
      FROM documents d
      LEFT JOIN cases c ON d.case_id = c.id
      WHERE d.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Find all documents with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Documents and pagination info
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      case_id,
      document_type,
      search,
    } = options;

    const offset = (page - 1) * limit;
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (case_id) {
      conditions.push(`d.case_id = $${paramIndex++}`);
      values.push(case_id);
    }

    if (document_type) {
      conditions.push(`d.document_type = $${paramIndex++}`);
      values.push(document_type);
    }

    if (search) {
      conditions.push(`d.document_name ILIKE $${paramIndex++}`);
      values.push(`%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM documents d ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT
        d.*,
        c.case_number,
        c.case_title
      FROM documents d
      LEFT JOIN cases c ON d.case_id = c.id
      ${whereClause}
      ORDER BY d.uploaded_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);
    const dataResult = await pool.query(dataQuery, values);

    return {
      documents: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find documents by case ID
   * @param {string} caseId - Case ID
   * @returns {Promise<Array>} List of documents
   */
  async findByCaseId(caseId) {
    const query = `
      SELECT * FROM documents
      WHERE case_id = $1
      ORDER BY uploaded_at DESC
    `;

    const result = await pool.query(query, [caseId]);
    return result.rows;
  }

  /**
   * Find documents by type
   * @param {string} documentType - Document type
   * @param {string} caseId - Case ID (optional)
   * @returns {Promise<Array>} List of documents
   */
  async findByType(documentType, caseId = null) {
    let query = `
      SELECT
        d.*,
        c.case_number,
        c.case_title
      FROM documents d
      LEFT JOIN cases c ON d.case_id = c.id
      WHERE d.document_type = $1
    `;

    const values = [documentType];

    if (caseId) {
      query += ` AND d.case_id = $2`;
      values.push(caseId);
    }

    query += ` ORDER BY d.uploaded_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Update document by ID
   * @param {string} id - Document ID
   * @param {Object} documentData - Updated document data
   * @returns {Promise<Object>} Updated document
   */
  async update(id, documentData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'document_name',
      'document_type',
      'document_url',
    ];

    allowedFields.forEach((field) => {
      if (documentData[field] !== undefined) {
        fields.push(`${field} = $${paramIndex++}`);
        values.push(documentData[field]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE documents
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundError('Document');
    }

    return result.rows[0];
  }

  /**
   * Delete document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Deleted document
   */
  async delete(id) {
    const query = 'DELETE FROM documents WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundError('Document');
    }

    return result.rows[0];
  }

  /**
   * Get document statistics by type
   * @param {string} caseId - Case ID (optional)
   * @returns {Promise<Array>} Document statistics by type
   */
  async getDocumentStatistics(caseId = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (caseId) {
      conditions.push(`case_id = $${paramIndex++}`);
      values.push(caseId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        document_type,
        COUNT(*) as document_count
      FROM documents
      ${whereClause}
      GROUP BY document_type
      ORDER BY document_count DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Search documents
   * @param {string} searchTerm - Search term
   * @param {string} caseId - Case ID (optional)
   * @returns {Promise<Array>} List of matching documents
   */
  async searchDocuments(searchTerm, caseId = null) {
    const conditions = ['d.document_name ILIKE $1'];
    const values = [`%${searchTerm}%`];
    let paramIndex = 2;

    if (caseId) {
      conditions.push(`d.case_id = $${paramIndex++}`);
      values.push(caseId);
    }

    const query = `
      SELECT
        d.*,
        c.case_number,
        c.case_title
      FROM documents d
      LEFT JOIN cases c ON d.case_id = c.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY d.uploaded_at DESC
      LIMIT 50
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Get recent documents
   * @param {number} limit - Number of documents to retrieve
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} List of recent documents
   */
  async getRecentDocuments(limit = 10, firmId = null) {
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (firmId) {
      conditions.push(`c.firm_id = $${paramIndex++}`);
      values.push(firmId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    values.push(limit);

    const query = `
      SELECT
        d.*,
        c.case_number,
        c.case_title,
        cl.first_name as client_first_name,
        cl.last_name as client_last_name,
        cl.company_name as client_company_name
      FROM documents d
      LEFT JOIN cases c ON d.case_id = c.id
      LEFT JOIN clients cl ON c.client_id = cl.id
      ${whereClause}
      ORDER BY d.uploaded_at DESC
      LIMIT $${paramIndex}
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Count documents by case
   * @param {string} caseId - Case ID
   * @returns {Promise<number>} Document count
   */
  async countByCaseId(caseId) {
    const query = 'SELECT COUNT(*) FROM documents WHERE case_id = $1';
    const result = await pool.query(query, [caseId]);
    return parseInt(result.rows[0].count);
  }
}

export default new DocumentRepository();
