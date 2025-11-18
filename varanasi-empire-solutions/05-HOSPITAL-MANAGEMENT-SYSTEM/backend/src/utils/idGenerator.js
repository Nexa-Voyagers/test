import { format } from 'date-fns';

/**
 * Generate patient ID
 * @param {string} hospitalCode - Hospital code
 * @returns {string} Patient ID (e.g., HSP-LKO-2025-001234)
 */
export const generatePatientId = (hospitalCode = 'HSP') => {
  const year = format(new Date(), 'yyyy');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${hospitalCode}-${year}-${random}`;
};

/**
 * Generate appointment ID
 * @param {string} prefix - Prefix
 * @returns {string} Appointment ID
 */
export const generateAppointmentId = (prefix = 'APT') => {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${date}-${random}`;
};

/**
 * Generate admission ID
 * @param {string} prefix - Prefix
 * @returns {string} Admission ID
 */
export const generateAdmissionId = (prefix = 'ADM') => {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${date}-${random}`;
};

/**
 * Generate bill number
 * @param {string} prefix - Prefix
 * @returns {string} Bill number
 */
export const generateBillNumber = (prefix = 'BILL') => {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${date}-${random}`;
};

/**
 * Generate prescription number
 * @param {string} prefix - Prefix
 * @returns {string} Prescription number
 */
export const generatePrescriptionNumber = (prefix = 'RX') => {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${date}-${random}`;
};

/**
 * Generate lab test ID
 * @param {string} prefix - Prefix
 * @returns {string} Lab test ID
 */
export const generateLabTestId = (prefix = 'LAB') => {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${date}-${random}`;
};

export default {
  generatePatientId,
  generateAppointmentId,
  generateAdmissionId,
  generateBillNumber,
  generatePrescriptionNumber,
  generateLabTestId,
};
