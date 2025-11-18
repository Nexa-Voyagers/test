import { pool, query, transaction } from '../config/database.js';

/**
 * Sale Repository
 * Handles all database operations for sales invoices and sale items
 */
class SaleRepository {
  /**
   * Create a new sales invoice with items (transactional)
   * @param {Object} saleData - Sale information
   * @param {Array} items - Sale items
   * @returns {Promise<Object>} Created invoice with items
   */
  async createSale(saleData, items) {
    return await transaction(async (client) => {
      // Create invoice
      const {
        store_id,
        customer_id,
        invoice_number,
        invoice_date,
        payment_method,
        payment_status,
        payment_received,
        notes
      } = saleData;

      const invoiceSql = `
        INSERT INTO sales_invoices (
          store_id, customer_id, invoice_number, invoice_date,
          subtotal, cgst, sgst, total_amount,
          payment_method, payment_status, payment_received, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

      // Calculate totals from items
      let subtotal = 0;
      let totalCgst = 0;
      let totalSgst = 0;

      items.forEach(item => {
        const itemSubtotal = item.quantity * item.unit_price;
        const gstAmount = (itemSubtotal * item.gst_percentage) / 100;
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;

        subtotal += itemSubtotal;
        totalCgst += cgst;
        totalSgst += sgst;
      });

      const totalAmount = subtotal + totalCgst + totalSgst;

      const invoiceValues = [
        store_id,
        customer_id || null,
        invoice_number,
        invoice_date || new Date(),
        subtotal,
        totalCgst,
        totalSgst,
        totalAmount,
        payment_method,
        payment_status || 'PAID',
        payment_received || totalAmount,
        notes || null
      ];

      const invoiceResult = await client.query(invoiceSql, invoiceValues);
      const invoice = invoiceResult.rows[0];

      // Create sale items and update stock
      const saleItems = [];
      for (const item of items) {
        const itemSql = `
          INSERT INTO sale_items (
            invoice_id, product_id, quantity, unit_price,
            discount_amount, gst_percentage, cgst, sgst, total_price
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *
        `;

        const itemSubtotal = item.quantity * item.unit_price;
        const discountAmount = item.discount_amount || 0;
        const subtotalAfterDiscount = itemSubtotal - discountAmount;
        const gstAmount = (subtotalAfterDiscount * item.gst_percentage) / 100;
        const cgst = gstAmount / 2;
        const sgst = gstAmount / 2;
        const totalPrice = subtotalAfterDiscount + gstAmount;

        const itemValues = [
          invoice.invoice_id,
          item.product_id,
          item.quantity,
          item.unit_price,
          discountAmount,
          item.gst_percentage,
          cgst,
          sgst,
          totalPrice
        ];

        const itemResult = await client.query(itemSql, itemValues);
        saleItems.push(itemResult.rows[0]);

        // Update product stock
        const stockSql = `
          UPDATE products
          SET stock_quantity = stock_quantity - $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE product_id = $2
        `;
        await client.query(stockSql, [item.quantity, item.product_id]);
      }

      // Update customer total purchases if customer exists
      if (customer_id) {
        const customerSql = `
          UPDATE customers
          SET total_purchases = total_purchases + $1,
              loyalty_tier = CASE
                WHEN (total_purchases + $1) >= 200000 THEN 'PLATINUM'
                WHEN (total_purchases + $1) >= 50000 THEN 'GOLD'
                ELSE 'SILVER'
              END,
              updated_at = CURRENT_TIMESTAMP
          WHERE customer_id = $2
        `;
        await client.query(customerSql, [totalAmount, customer_id]);

        // Update outstanding balance if not fully paid
        if (payment_status !== 'PAID') {
          const balanceDue = totalAmount - (payment_received || 0);
          if (balanceDue > 0) {
            const balanceSql = `
              UPDATE customers
              SET outstanding_balance = outstanding_balance + $1,
                  updated_at = CURRENT_TIMESTAMP
              WHERE customer_id = $2
            `;
            await client.query(balanceSql, [balanceDue, customer_id]);
          }
        }
      }

      return {
        ...invoice,
        items: saleItems
      };
    });
  }

  /**
   * Find invoice by ID with items
   * @param {number} id - Invoice ID
   * @returns {Promise<Object|null>} Invoice with items or null
   */
  async findById(id) {
    const invoiceSql = `
      SELECT si.*,
        c.customer_name,
        c.phone as customer_phone,
        s.store_name
      FROM sales_invoices si
      LEFT JOIN customers c ON si.customer_id = c.customer_id
      LEFT JOIN textile_stores s ON si.store_id = s.store_id
      WHERE si.invoice_id = $1
    `;
    const invoiceResult = await query(invoiceSql, [id]);

    if (invoiceResult.rows.length === 0) {
      return null;
    }

    const invoice = invoiceResult.rows[0];

    // Get sale items
    const itemsSql = `
      SELECT sit.*,
        p.product_name,
        p.product_code
      FROM sale_items sit
      LEFT JOIN products p ON sit.product_id = p.product_id
      WHERE sit.invoice_id = $1
      ORDER BY sit.item_id
    `;
    const itemsResult = await query(itemsSql, [id]);

    return {
      ...invoice,
      items: itemsResult.rows
    };
  }

  /**
   * Find invoice by invoice number
   * @param {string} invoiceNumber - Invoice number
   * @returns {Promise<Object|null>} Invoice with items or null
   */
  async findByInvoiceNumber(invoiceNumber) {
    const sql = 'SELECT invoice_id FROM sales_invoices WHERE invoice_number = $1';
    const result = await query(sql, [invoiceNumber]);

    if (result.rows.length === 0) {
      return null;
    }

    return await this.findById(result.rows[0].invoice_id);
  }

  /**
   * Find all invoices with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of invoices
   */
  async findAll(filters = {}) {
    let sql = `
      SELECT si.*,
        c.customer_name,
        c.phone as customer_phone,
        s.store_name
      FROM sales_invoices si
      LEFT JOIN customers c ON si.customer_id = c.customer_id
      LEFT JOIN textile_stores s ON si.store_id = s.store_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND si.store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.customer_id) {
      sql += ` AND si.customer_id = $${paramCount}`;
      values.push(filters.customer_id);
      paramCount++;
    }

    if (filters.payment_status) {
      sql += ` AND si.payment_status = $${paramCount}`;
      values.push(filters.payment_status);
      paramCount++;
    }

    if (filters.payment_method) {
      sql += ` AND si.payment_method = $${paramCount}`;
      values.push(filters.payment_method);
      paramCount++;
    }

    if (filters.start_date) {
      sql += ` AND si.invoice_date >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      sql += ` AND si.invoice_date <= $${paramCount}`;
      values.push(filters.end_date);
      paramCount++;
    }

    sql += ' ORDER BY si.invoice_date DESC, si.created_at DESC';

    if (filters.limit) {
      sql += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      sql += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
    }

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Update invoice payment status
   * @param {number} id - Invoice ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object|null>} Updated invoice or null
   */
  async updatePayment(id, paymentData) {
    return await transaction(async (client) => {
      // Get current invoice
      const currentSql = 'SELECT * FROM sales_invoices WHERE invoice_id = $1';
      const currentResult = await client.query(currentSql, [id]);

      if (currentResult.rows.length === 0) {
        return null;
      }

      const currentInvoice = currentResult.rows[0];

      // Update invoice
      const sql = `
        UPDATE sales_invoices
        SET payment_status = $1,
            payment_received = $2,
            payment_method = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE invoice_id = $4
        RETURNING *
      `;

      const values = [
        paymentData.payment_status,
        paymentData.payment_received,
        paymentData.payment_method || currentInvoice.payment_method,
        id
      ];

      const result = await client.query(sql, values);
      const updatedInvoice = result.rows[0];

      // Update customer outstanding balance if customer exists
      if (currentInvoice.customer_id) {
        const previousBalance = currentInvoice.total_amount - currentInvoice.payment_received;
        const newBalance = updatedInvoice.total_amount - updatedInvoice.payment_received;
        const balanceChange = newBalance - previousBalance;

        if (balanceChange !== 0) {
          const operator = balanceChange > 0 ? '+' : '-';
          const amount = Math.abs(balanceChange);

          const customerSql = `
            UPDATE customers
            SET outstanding_balance = outstanding_balance ${operator} $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE customer_id = $2
          `;
          await client.query(customerSql, [amount, currentInvoice.customer_id]);
        }
      }

      return updatedInvoice;
    });
  }

  /**
   * Get sales summary for a date range
   * @param {Object} filters - Filter options
   * @returns {Promise<Object>} Sales summary
   */
  async getSalesSummary(filters = {}) {
    let sql = `
      SELECT
        COUNT(*) as total_invoices,
        SUM(subtotal) as total_subtotal,
        SUM(cgst) as total_cgst,
        SUM(sgst) as total_sgst,
        SUM(total_amount) as total_sales,
        SUM(payment_received) as total_received,
        SUM(total_amount - payment_received) as total_outstanding,
        AVG(total_amount) as average_sale_value
      FROM sales_invoices
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.start_date) {
      sql += ` AND invoice_date >= $${paramCount}`;
      values.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      sql += ` AND invoice_date <= $${paramCount}`;
      values.push(filters.end_date);
    }

    const result = await query(sql, values);
    return result.rows[0];
  }

  /**
   * Get top selling products
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Top selling products
   */
  async getTopSellingProducts(filters = {}) {
    const { limit = 10, start_date, end_date, store_id } = filters;

    let sql = `
      SELECT
        p.product_id,
        p.product_name,
        p.product_code,
        SUM(sit.quantity) as total_quantity_sold,
        SUM(sit.total_price) as total_revenue,
        COUNT(DISTINCT sit.invoice_id) as number_of_sales
      FROM sale_items sit
      INNER JOIN products p ON sit.product_id = p.product_id
      INNER JOIN sales_invoices si ON sit.invoice_id = si.invoice_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (store_id) {
      sql += ` AND si.store_id = $${paramCount}`;
      values.push(store_id);
      paramCount++;
    }

    if (start_date) {
      sql += ` AND si.invoice_date >= $${paramCount}`;
      values.push(start_date);
      paramCount++;
    }

    if (end_date) {
      sql += ` AND si.invoice_date <= $${paramCount}`;
      values.push(end_date);
      paramCount++;
    }

    sql += `
      GROUP BY p.product_id, p.product_name, p.product_code
      ORDER BY total_quantity_sold DESC
      LIMIT $${paramCount}
    `;
    values.push(limit);

    const result = await query(sql, values);
    return result.rows;
  }

  /**
   * Count invoices with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Total count
   */
  async count(filters = {}) {
    let sql = 'SELECT COUNT(*) FROM sales_invoices WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.store_id) {
      sql += ` AND store_id = $${paramCount}`;
      values.push(filters.store_id);
      paramCount++;
    }

    if (filters.payment_status) {
      sql += ` AND payment_status = $${paramCount}`;
      values.push(filters.payment_status);
    }

    const result = await query(sql, values);
    return parseInt(result.rows[0].count);
  }

  /**
   * Delete invoice (soft delete - not recommended for sales)
   * @param {number} id - Invoice ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    // This should be used very carefully in production
    // Consider adding a 'cancelled' status instead
    const sql = 'DELETE FROM sales_invoices WHERE invoice_id = $1';
    const result = await query(sql, [id]);
    return result.rowCount > 0;
  }
}

export default new SaleRepository();
