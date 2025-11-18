import Joi from 'joi';
import documentService from '../services/document.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ValidationError } from '../utils/errors.js';

/**
 * Document Controller
 * Handles HTTP requests for document operations
 */

// Validation schemas
const createDocumentSchema = Joi.object({
  case_id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid case ID format',
    'any.required': 'Case ID is required',
  }),
  document_name: Joi.string().required().max(255).messages({
    'string.empty': 'Document name is required',
    'any.required': 'Document name is required',
  }),
  document_type: Joi.string()
    .valid('PETITION', 'AFFIDAVIT', 'NOTICE', 'EVIDENCE', 'CONTRACT', 'AGREEMENT', 'CORRESPONDENCE')
    .required()
    .messages({
      'any.only': 'Document type must be one of: PETITION, AFFIDAVIT, NOTICE, EVIDENCE, CONTRACT, AGREEMENT, CORRESPONDENCE',
      'any.required': 'Document type is required',
    }),
  document_url: Joi.string().uri().max(500).required().messages({
    'string.uri': 'Document URL must be a valid URL',
    'any.required': 'Document URL is required',
  }),
});

const updateDocumentSchema = Joi.object({
  document_name: Joi.string().max(255),
  document_type: Joi.string()
    .valid('PETITION', 'AFFIDAVIT', 'NOTICE', 'EVIDENCE', 'CONTRACT', 'AGREEMENT', 'CORRESPONDENCE'),
  document_url: Joi.string().uri().max(500),
});

/**
 * Create a new document
 */
export const createDocument = asyncHandler(async (req, res) => {
  const { error, value } = createDocumentSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const document = await documentService.createDocument(value);

  res.status(201).json({
    success: true,
    message: 'Document created successfully',
    data: document,
  });
});

/**
 * Get document by ID
 */
export const getDocumentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const document = await documentService.getDocumentById(id);

  res.status(200).json({
    success: true,
    data: document,
  });
});

/**
 * Get all documents with pagination
 */
export const getAllDocuments = asyncHandler(async (req, res) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    case_id: req.query.case_id,
    document_type: req.query.document_type,
    search: req.query.search,
  };

  const result = await documentService.getAllDocuments(options);

  res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * Get documents by case ID
 */
export const getDocumentsByCaseId = asyncHandler(async (req, res) => {
  const { caseId } = req.params;
  const documents = await documentService.getDocumentsByCaseId(caseId);

  res.status(200).json({
    success: true,
    data: documents,
  });
});

/**
 * Get documents by type
 */
export const getDocumentsByType = asyncHandler(async (req, res) => {
  const { documentType } = req.params;
  const caseId = req.query.case_id || null;

  const documents = await documentService.getDocumentsByType(documentType, caseId);

  res.status(200).json({
    success: true,
    data: documents,
  });
});

/**
 * Update document
 */
export const updateDocument = asyncHandler(async (req, res) => {
  const { error, value } = updateDocumentSchema.validate(req.body);

  if (error) {
    throw new ValidationError(error.details.map(d => d.message));
  }

  const { id } = req.params;
  const document = await documentService.updateDocument(id, value);

  res.status(200).json({
    success: true,
    message: 'Document updated successfully',
    data: document,
  });
});

/**
 * Delete document
 */
export const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const document = await documentService.deleteDocument(id);

  res.status(200).json({
    success: true,
    message: 'Document deleted successfully',
    data: document,
  });
});

/**
 * Get document statistics
 */
export const getDocumentStatistics = asyncHandler(async (req, res) => {
  const caseId = req.query.case_id || null;
  const stats = await documentService.getDocumentStatistics(caseId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * Search documents
 */
export const searchDocuments = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const caseId = req.query.case_id || null;

  if (!query) {
    throw new ValidationError(['Search query is required']);
  }

  const documents = await documentService.searchDocuments(query, caseId);

  res.status(200).json({
    success: true,
    data: documents,
  });
});

/**
 * Get recent documents
 */
export const getRecentDocuments = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const firmId = req.query.firm_id || null;

  const documents = await documentService.getRecentDocuments(limit, firmId);

  res.status(200).json({
    success: true,
    data: documents,
  });
});

/**
 * Get valid document types
 */
export const getValidDocumentTypes = asyncHandler(async (req, res) => {
  const types = documentService.getValidDocumentTypes();

  res.status(200).json({
    success: true,
    data: types,
  });
});
