import { feeRepository } from '../repositories/fee.repository.js';
import { AppError } from '../utils/errors.js';

class FeeService {
  async createFeeStructure(feeStructureData) {
    return await feeRepository.createStructure(feeStructureData);
  }

  async getAllFeeStructures(schoolId, filters) {
    return await feeRepository.findAllStructures(schoolId, filters);
  }

  async generateFeeInvoices(invoiceData) {
    // Get students in the class/section
    const students = await feeRepository.getStudentsByClassSection(
      invoiceData.classId,
      invoiceData.sectionId
    );

    // Get fee structure
    const feeStructure = await feeRepository.findStructureById(invoiceData.feeStructureId);
    if (!feeStructure) {
      throw new AppError('Fee structure not found', 404);
    }

    // Generate invoices for each student
    const invoices = students.map(student => ({
      studentId: student.id,
      feeStructureId: invoiceData.feeStructureId,
      academicYear: feeStructure.academic_year,
      totalAmount: feeStructure.total_amount,
      dueDate: invoiceData.dueDate,
      status: 'PENDING',
      generatedBy: invoiceData.generatedBy,
    }));

    await feeRepository.bulkCreateInvoices(invoices);

    return { count: invoices.length };
  }

  async getStudentInvoices(studentId, filters) {
    return await feeRepository.findInvoicesByStudentId(studentId, filters);
  }

  async recordFeePayment(paymentData) {
    // Get invoice
    const invoice = await feeRepository.findInvoiceById(paymentData.invoiceId);
    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    // Record payment
    const payment = await feeRepository.createPayment(paymentData);

    // Update invoice status
    const paidAmount = await feeRepository.getInvoicePaidAmount(paymentData.invoiceId);
    if (paidAmount >= invoice.total_amount) {
      await feeRepository.updateInvoiceStatus(paymentData.invoiceId, 'PAID');
    } else {
      await feeRepository.updateInvoiceStatus(paymentData.invoiceId, 'PARTIAL');
    }

    return payment;
  }

  async getPaymentHistory(studentId, academicYear) {
    return await feeRepository.findPaymentsByStudentId(studentId, academicYear);
  }

  async getFeeDefaulters(schoolId, filters) {
    return await feeRepository.findDefaulters(schoolId, filters);
  }

  async applyDiscount(discountData) {
    const invoice = await feeRepository.findInvoiceById(discountData.invoiceId);
    if (!invoice) {
      throw new AppError('Invoice not found', 404);
    }

    return await feeRepository.applyDiscount(discountData);
  }

  async generateReceipt(paymentId) {
    const payment = await feeRepository.findPaymentById(paymentId);
    if (!payment) {
      throw new AppError('Payment not found', 404);
    }

    // Generate receipt data
    return {
      payment,
      receiptNumber: `REC-${payment.id}`,
      generatedAt: new Date(),
    };
  }

  async getFeeCollectionReport(schoolId, filters) {
    return await feeRepository.getCollectionReport(schoolId, filters);
  }

  async sendFeeReminders(schoolId, filters) {
    const pendingInvoices = await feeRepository.findPendingInvoices(schoolId, filters);

    // Send reminders (implement notification service)
    // for (const invoice of pendingInvoices) {
    //   await notificationService.sendFeeReminder(invoice.student_id, invoice);
    // }

    return { count: pendingInvoices.length };
  }
}

export const feeService = new FeeService();
