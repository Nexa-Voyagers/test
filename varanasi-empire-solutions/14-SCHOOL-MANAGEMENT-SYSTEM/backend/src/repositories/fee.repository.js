import { pool } from '../config/database.js';

class FeeRepository {
  async createStructure(feeStructureData) {
    const result = await pool.query(
      `INSERT INTO fee_structures (school_id, class_id, academic_year, fee_type, amount, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [feeStructureData.schoolId, feeStructureData.classId, feeStructureData.academicYear,
       feeStructureData.feeType, feeStructureData.amount, feeStructureData.description]
    );
    return result.rows[0];
  }

  async findAllStructures(schoolId, filters) {
    let query = 'SELECT * FROM fee_structures WHERE school_id = $1';
    const params = [schoolId];

    if (filters.academicYear) {
      params.push(filters.academicYear);
      query += ` AND academic_year = $${params.length}`;
    }

    if (filters.classId) {
      params.push(filters.classId);
      query += ` AND class_id = $${params.length}`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  async findStructureById(id) {
    const result = await pool.query('SELECT * FROM fee_structures WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getStudentsByClassSection(classId, sectionId) {
    const result = await pool.query(
      'SELECT id FROM students WHERE current_class_id = $1 AND current_section_id = $2 AND status = $3',
      [classId, sectionId, 'ACTIVE']
    );
    return result.rows;
  }

  async bulkCreateInvoices(invoices) {
    const values = invoices.map(inv => 
      `('${inv.studentId}', '${inv.feeStructureId}', '${inv.academicYear}', ${inv.totalAmount}, '${inv.dueDate}', '${inv.status}', '${inv.generatedBy}')`
    ).join(',');

    const query = `INSERT INTO fee_invoices (student_id, fee_structure_id, academic_year, total_amount, due_date, status, generated_by)
                   VALUES ${values}`;
    await pool.query(query);
  }

  async findInvoicesByStudentId(studentId, filters) {
    let query = 'SELECT * FROM fee_invoices WHERE student_id = $1';
    const params = [studentId];

    if (filters.status) {
      params.push(filters.status);
      query += ` AND status = $${params.length}`;
    }

    if (filters.academicYear) {
      params.push(filters.academicYear);
      query += ` AND academic_year = $${params.length}`;
    }

    query += ' ORDER BY due_date DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findInvoiceById(id) {
    const result = await pool.query('SELECT * FROM fee_invoices WHERE id = $1', [id]);
    return result.rows[0];
  }

  async createPayment(paymentData) {
    const result = await pool.query(
      `INSERT INTO fee_payments (invoice_id, student_id, amount_paid, payment_mode, payment_date, transaction_id, received_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [paymentData.invoiceId, paymentData.studentId, paymentData.amountPaid, paymentData.paymentMode,
       paymentData.paymentDate || new Date(), paymentData.transactionId, paymentData.receivedBy]
    );
    return result.rows[0];
  }

  async getInvoicePaidAmount(invoiceId) {
    const result = await pool.query(
      'SELECT COALESCE(SUM(amount_paid), 0) as paid FROM fee_payments WHERE invoice_id = $1',
      [invoiceId]
    );
    return parseFloat(result.rows[0].paid);
  }

  async updateInvoiceStatus(invoiceId, status) {
    await pool.query(
      'UPDATE fee_invoices SET status = $2, updated_at = NOW() WHERE id = $1',
      [invoiceId, status]
    );
  }

  async findPaymentsByStudentId(studentId, academicYear) {
    let query = 'SELECT * FROM fee_payments WHERE student_id = $1';
    const params = [studentId];

    if (academicYear) {
      params.push(academicYear);
      query += ` AND academic_year = $2`;
    }

    query += ' ORDER BY payment_date DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findPaymentById(id) {
    const result = await pool.query('SELECT * FROM fee_payments WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findDefaulters(schoolId, filters) {
    let query = `SELECT fi.*, s.first_name, s.last_name, s.admission_number
                 FROM fee_invoices fi
                 JOIN students s ON fi.student_id = s.id
                 WHERE s.school_id = $1 AND fi.status IN ('PENDING', 'PARTIAL') AND fi.due_date < NOW()`;
    const params = [schoolId];

    if (filters.classId) {
      params.push(filters.classId);
      query += ` AND s.current_class_id = $${params.length}`;
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  async applyDiscount(discountData) {
    const result = await pool.query(
      `INSERT INTO fee_discounts (student_id, invoice_id, discount_type, discount_amount, reason, applied_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [discountData.studentId, discountData.invoiceId, discountData.discountType, 
       discountData.discountAmount, discountData.reason, discountData.appliedBy]
    );
    return result.rows[0];
  }

  async getCollectionReport(schoolId, filters) {
    let query = `SELECT DATE(fp.payment_date) as date, SUM(fp.amount_paid) as total_amount, COUNT(*) as count
                 FROM fee_payments fp
                 JOIN students s ON fp.student_id = s.id
                 WHERE s.school_id = $1`;
    const params = [schoolId];

    if (filters.startDate && filters.endDate) {
      params.push(filters.startDate, filters.endDate);
      query += ` AND fp.payment_date BETWEEN $2 AND $3`;
    }

    query += ' GROUP BY DATE(fp.payment_date) ORDER BY date DESC';
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findPendingInvoices(schoolId, filters) {
    let query = `SELECT fi.*, s.first_name, s.last_name
                 FROM fee_invoices fi
                 JOIN students s ON fi.student_id = s.id
                 WHERE s.school_id = $1 AND fi.status = 'PENDING'`;
    const params = [schoolId];

    const result = await pool.query(query, params);
    return result.rows;
  }
}

export const feeRepository = new FeeRepository();
