import { query } from '../config/database.js';

const createSale = async (saleData) => {
  const result = await query(
    `INSERT INTO pharmacy_sales (
      sale_id, hospital_id, patient_id, prescription_id,
      sale_date, total_amount, payment_status, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      saleData.sale_id,
      saleData.hospital_id,
      saleData.patient_id,
      saleData.prescription_id,
      saleData.sale_date || new Date(),
      saleData.total_amount,
      saleData.payment_status || 'PAID',
      saleData.created_by,
    ]
  );
  return result.rows[0];
};

const addSaleItem = async (itemData) => {
  const result = await query(
    `INSERT INTO pharmacy_sale_items (
      sale_id, medicine_id, medicine_name, batch_number, quantity,
      unit_price, total_price, expiry_date
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      itemData.sale_id,
      itemData.medicine_id,
      itemData.medicine_name,
      itemData.batch_number,
      itemData.quantity,
      itemData.unit_price,
      itemData.total_price,
      itemData.expiry_date,
    ]
  );
  return result.rows[0];
};

const findMedicineByName = async (hospitalId, searchTerm) => {
  const result = await query(
    `SELECT m.*, s.available_quantity, s.batch_number, s.expiry_date
     FROM medicines m
     JOIN medicine_stock s ON m.id = s.medicine_id
     WHERE m.hospital_id = $1
     AND m.is_active = true
     AND s.available_quantity > 0
     AND (m.medicine_name ILIKE $2 OR m.generic_name ILIKE $2)
     ORDER BY m.medicine_name
     LIMIT 20`,
    [hospitalId, `%${searchTerm}%`]
  );
  return result.rows;
};

const updateStock = async (medicineId, quantitySold) => {
  const result = await query(
    `UPDATE medicine_stock
     SET available_quantity = available_quantity - $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE medicine_id = $2
     AND batch_number = (
       SELECT batch_number FROM medicine_stock
       WHERE medicine_id = $2
       AND available_quantity >= $1
       ORDER BY expiry_date
       LIMIT 1
     )
     RETURNING *`,
    [quantitySold, medicineId]
  );
  return result.rows[0];
};

const getLowStockMedicines = async (hospitalId, threshold = 10) => {
  const result = await query(
    `SELECT m.*, SUM(s.available_quantity) as total_stock
     FROM medicines m
     JOIN medicine_stock s ON m.id = s.medicine_id
     WHERE m.hospital_id = $1
     GROUP BY m.id
     HAVING SUM(s.available_quantity) <= $2
     ORDER BY total_stock`,
    [hospitalId, threshold]
  );
  return result.rows;
};

const getExpiringMedicines = async (hospitalId, days = 30) => {
  const result = await query(
    `SELECT m.*, s.batch_number, s.expiry_date, s.available_quantity
     FROM medicines m
     JOIN medicine_stock s ON m.id = s.medicine_id
     WHERE m.hospital_id = $1
     AND s.expiry_date <= CURRENT_DATE + INTERVAL '${days} days'
     AND s.available_quantity > 0
     ORDER BY s.expiry_date`,
    [hospitalId]
  );
  return result.rows;
};

export const pharmacyRepository = {
  createSale,
  addSaleItem,
  findMedicineByName,
  updateStock,
  getLowStockMedicines,
  getExpiringMedicines,
};

export default pharmacyRepository;
