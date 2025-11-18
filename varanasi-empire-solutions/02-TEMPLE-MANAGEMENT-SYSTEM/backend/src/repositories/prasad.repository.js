import { query } from '../config/database.js';

const createPrasadOrder = async (orderData) => {
  const result = await query(
    `INSERT INTO prasad_orders (
      order_id, temple_id, devotee_id, prasad_id, quantity,
      unit_price, total_amount, delivery_type, delivery_address,
      payment_status, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`,
    [
      orderData.order_id,
      orderData.temple_id,
      orderData.devotee_id,
      orderData.prasad_id,
      orderData.quantity,
      orderData.unit_price,
      orderData.total_amount,
      orderData.delivery_type || 'COUNTER',
      orderData.delivery_address,
      orderData.payment_status || 'PENDING',
      orderData.created_by,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT po.*, p.prasad_name, p.category,
            d.first_name, d.last_name, d.phone
     FROM prasad_orders po
     JOIN prasads p ON po.prasad_id = p.id
     LEFT JOIN devotees d ON po.devotee_id = d.id
     WHERE po.id = $1`,
    [id]
  );
  return result.rows[0];
};

const getPrasadInventory = async (templeId) => {
  const result = await query(
    `SELECT * FROM prasads
     WHERE temple_id = $1 AND is_active = true
     ORDER BY category, prasad_name`,
    [templeId]
  );
  return result.rows;
};

const updateStock = async (prasadId, quantitySold) => {
  const result = await query(
    `UPDATE prasads
     SET current_stock = current_stock - $1,
         total_sold = total_sold + $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [quantitySold, prasadId]
  );
  return result.rows[0];
};

const getPendingOrders = async (templeId) => {
  const result = await query(
    `SELECT po.*, p.prasad_name, d.first_name, d.last_name, d.phone
     FROM prasad_orders po
     JOIN prasads p ON po.prasad_id = p.id
     LEFT JOIN devotees d ON po.devotee_id = d.id
     WHERE po.temple_id = $1
     AND po.status IN ('PENDING', 'PROCESSING')
     ORDER BY po.created_at`,
    [templeId]
  );
  return result.rows;
};

const updateOrderStatus = async (orderId, status, trackingDetails = {}) => {
  const result = await query(
    `UPDATE prasad_orders
     SET status = $1,
         tracking_number = $2,
         dispatch_date = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [status, trackingDetails.tracking_number, trackingDetails.dispatch_date, orderId]
  );
  return result.rows[0];
};

export const prasadRepository = {
  createPrasadOrder,
  findById,
  getPrasadInventory,
  updateStock,
  getPendingOrders,
  updateOrderStatus,
};

export default prasadRepository;
