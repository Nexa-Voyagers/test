import documentRepository from '../repositories/document.repository.js';
import caseRepository from '../repositories/case.repository.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Document Service
 * Business logic for document operations
 */
class DocumentService {
  /**
   * Create a new document
   * @param {Object} documentData - Document data
   * @returns {Promise<Object>} Created document
   */
  async createDocument(documentData) {
    // Verify case exists
    const caseExists = await caseRepository.findById(documentData.case_id);
    if (!caseExists) {
      throw new NotFoundError('Case');
    }

    // Validate document type
    const validTypes = [
      'PETITION',
      'AFFIDAVIT',
      'NOTICE',
      'EVIDENCE',
      'CONTRACT',
      'AGREEMENT',
      'CORRESPONDENCE',
    ];

    if (documentData.document_type && !validTypes.includes(documentData.document_type)) {
      throw new Error(`Invalid document type. Must be one of: ${validTypes.join(', ')}`);
    }

    return await documentRepository.create(documentData);
  }

  /**
   * Get document by ID
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Document object
   */
  async getDocumentById(id) {
    const document = await documentRepository.findById(id);

    if (!document) {
      throw new NotFoundError('Document');
    }

    return document;
  }

  /**
   * Get all documents with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Documents and pagination info
   */
  async getAllDocuments(options) {
    return await documentRepository.findAll(options);
  }

  /**
   * Get documents by case ID
   * @param {string} caseId - Case ID
   * @returns {Promise<Array>} List of documents
   */
  async getDocumentsByCaseId(caseId) {
    // Verify case exists
    const caseExists = await caseRepository.findById(caseId);
    if (!caseExists) {
      throw new NotFoundError('Case');
    }

    return await documentRepository.findByCaseId(caseId);
  }

  /**
   * Get documents by type
   * @param {string} documentType - Document type
   * @param {string} caseId - Case ID (optional)
   * @returns {Promise<Array>} List of documents
   */
  async getDocumentsByType(documentType, caseId = null) {
    // Validate document type
    const validTypes = [
      'PETITION',
      'AFFIDAVIT',
      'NOTICE',
      'EVIDENCE',
      'CONTRACT',
      'AGREEMENT',
      'CORRESPONDENCE',
    ];

    if (!validTypes.includes(documentType)) {
      throw new Error(`Invalid document type. Must be one of: ${validTypes.join(', ')}`);
    }

    // Verify case exists if caseId is provided
    if (caseId) {
      const caseExists = await caseRepository.findById(caseId);
      if (!caseExists) {
        throw new NotFoundError('Case');
      }
    }

    return await documentRepository.findByType(documentType, caseId);
  }

  /**
   * Update document
   * @param {string} id - Document ID
   * @param {Object} documentData - Updated document data
   * @returns {Promise<Object>} Updated document
   */
  async updateDocument(id, documentData) {
    // Validate document type if provided
    if (documentData.document_type) {
      const validTypes = [
        'PETITION',
        'AFFIDAVIT',
        'NOTICE',
        'EVIDENCE',
        'CONTRACT',
        'AGREEMENT',
        'CORRESPONDENCE',
      ];

      if (!validTypes.includes(documentData.document_type)) {
        throw new Error(`Invalid document type. Must be one of: ${validTypes.join(', ')}`);
      }
    }

    return await documentRepository.update(id, documentData);
  }

  /**
   * Delete document
   * @param {string} id - Document ID
   * @returns {Promise<Object>} Deleted document
   */
  async deleteDocument(id) {
    return await documentRepository.delete(id);
  }

  /**
   * Get document statistics
   * @param {string} caseId - Case ID (optional)
   * @returns {Promise<Array>} Document statistics by type
   */
  async getDocumentStatistics(caseId = null) {
    // Verify case exists if caseId is provided
    if (caseId) {
      const caseExists = await caseRepository.findById(caseId);
      if (!caseExists) {
        throw new NotFoundError('Case');
      }
    }

    const stats = await documentRepository.getDocumentStatistics(caseId);

    // Calculate total
    const total = stats.reduce((sum, stat) => sum + parseInt(stat.document_count), 0);

    // Add percentage to each stat
    return stats.map(stat => ({
      ...stat,
      percentage: total > 0 ? ((parseInt(stat.document_count) / total) * 100).toFixed(2) : 0,
    }));
  }

  /**
   * Search documents
   * @param {string} searchTerm - Search term
   * @param {string} caseId - Case ID (optional)
   * @returns {Promise<Array>} List of matching documents
   */
  async searchDocuments(searchTerm, caseId = null) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Search term must be at least 2 characters');
    }

    // Verify case exists if caseId is provided
    if (caseId) {
      const caseExists = await caseRepository.findById(caseId);
      if (!caseExists) {
        throw new NotFoundError('Case');
      }
    }

    return await documentRepository.searchDocuments(searchTerm, caseId);
  }

  /**
   * Get recent documents
   * @param {number} limit - Number of documents to retrieve
   * @param {string} firmId - Firm ID (optional)
   * @returns {Promise<Array>} List of recent documents
   */
  async getRecentDocuments(limit = 10, firmId = null) {
    return await documentRepository.getRecentDocuments(limit, firmId);
  }

  /**
   * Validate document URL
   * @param {string} url - Document URL
   * @returns {boolean} Is valid URL
   */
  validateDocumentUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get document file extension
   * @param {string} url - Document URL
   * @returns {string} File extension
   */
  getFileExtension(url) {
    if (!url) return '';

    const parts = url.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toLowerCase();
    }

    return '';
  }

  /**
   * Get valid document types
   * @returns {Array} List of valid document types
   */
  getValidDocumentTypes() {
    return [
      'PETITION',
      'AFFIDAVIT',
      'NOTICE',
      'EVIDENCE',
      'CONTRACT',
      'AGREEMENT',
      'CORRESPONDENCE',
    ];
  }
}

export default new DocumentService();
