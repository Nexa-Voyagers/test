import { billingRepository } from '../repositories/billing.repository.js';
import { patientRepository } from '../repositories/patient.repository.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { generateBillNumber } from '../utils/idGenerator.js';
import { transaction } from '../config/database.js';

/**
 * Create bill with items
 */
const createBill = async (billData, billItems) => {
  // Verify patient exists
  const patient = await patientRepository.findById(billData.patient_id);
  if (!patient) {
    throw new NotFoundError('Patient');
  }

  // Validate bill items
  if (!billItems || billItems.length === 0) {
    throw new ValidationError([{ field: 'billItems', message: 'At least one item is required' }]);
  }

  // Calculate totals
  const subtotal = billItems.reduce((sum, item) => sum + item.total_price, 0);
  const taxAmount = (subtotal * 0.18); // 18% GST
  const totalAmount = subtotal + taxAmount - (billData.discount_amount || 0);

  // Generate bill number
  const billNumber = generateBillNumber();

  // Create bill and items in transaction
  const bill = await transaction(async (client) => {
    // Create bill
    const createdBill = await billingRepository.create({
      ...billData,
      bill_number: billNumber,
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    });

    // Add bill items
    for (const item of billItems) {
      await billingRepository.addBillItem({
        ...item,
        bill_id: createdBill.id,
      });
    }

    return createdBill;
  });

  // Get complete bill with items
  const completeBill = await getBill(bill.id);
  return completeBill;
};

/**
 * Get bill by ID
 */
const getBill = async (id) => {
  const bill = await billingRepository.findById(id);
  if (!bill) {
    throw new NotFoundError('Bill');
  }

  // Get bill items
  const items = await billingRepository.getBillItems(id);
  bill.items = items;

  return bill;
};

/**
 * Get bill by bill number
 */
const getBillByNumber = async (billNumber) => {
  const bill = await billingRepository.findByBillNumber(billNumber);
  if (!bill) {
    throw new NotFoundError('Bill');
  }

  // Get bill items
  const items = await billingRepository.getBillItems(bill.id);
  bill.items = items;

  return bill;
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (billId, paymentData) => {
  const bill = await billingRepository.findById(billId);
  if (!bill) {
    throw new NotFoundError('Bill');
  }

  if (bill.payment_status === 'PAID') {
    throw new ValidationError([
      { field: 'payment_status', message: 'Bill is already paid' },
    ]);
  }

  const validMethods = ['CASH', 'CARD', 'UPI', 'NET_BANKING', 'INSURANCE'];
  if (!validMethods.includes(paymentData.payment_method)) {
    throw new ValidationError([
      { field: 'payment_method', message: 'Invalid payment method' },
    ]);
  }

  const updatedBill = await billingRepository.updatePaymentStatus(billId, 'PAID', paymentData);
  return updatedBill;
};

/**
 * Get revenue report
 */
const getRevenueReport = async (hospitalId, startDate, endDate) => {
  const revenue = await billingRepository.getRevenue(hospitalId, startDate, endDate);
  return revenue;
};

/**
 * Generate invoice PDF (stub - would use PDFKit in real implementation)
 */
const generateInvoicePDF = async (billId) => {
  const bill = await getBill(billId);

  // In real implementation, would use PDFKit to generate PDF
  // For now, return bill data
  return {
    message: 'PDF generation would be implemented here',
    bill,
  };
};

export const billingService = {
  createBill,
  getBill,
  getBillByNumber,
  updatePaymentStatus,
  getRevenueReport,
  generateInvoicePDF,
};

export default billingService;
