#!/bin/bash
BASE="/home/user/test/varanasi-empire-solutions/16-TRANSPORT-LOGISTICS/backend/src"

# Create remaining repositories
for repo in company customer trip route warehouse expense report; do
cat > "$BASE/repositories/${repo}.repository.js" << EOF
import { pool } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const ${repo}Repository = {
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, i) => \\\$\${i + 1}).join(',');
    const query = \\\`INSERT INTO ${repo}s (\${keys.join(',')}) VALUES (\${placeholders}) RETURNING *\\\`;
    const result = await pool.query(query, values);
    return result.rows[0];
  },
  async findAll(filters = {}) {
    const query = 'SELECT * FROM ${repo}s ORDER BY created_at DESC LIMIT \$1 OFFSET \$2';
    const result = await pool.query(query, [filters.limit || 50, filters.offset || 0]);
    return result.rows;
  },
  async findById(id) {
    const result = await pool.query('SELECT * FROM ${repo}s WHERE id = \$1', [id]);
    if (result.rows.length === 0) throw new NotFoundError('${repo} not found');
    return result.rows[0];
  },
  async update(id, data) {
    const fields = []; const values = []; let paramCount = 1;
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) { fields.push(\\\`\${key} = \\\$\${paramCount}\\\`); values.push(data[key]); paramCount++; }
    });
    if (fields.length === 0) throw new Error('No fields to update');
    fields.push('updated_at = NOW()'); values.push(id);
    const query = \\\`UPDATE ${repo}s SET \${fields.join(', ')} WHERE id = \\\$\${paramCount} RETURNING *\\\`;
    const result = await pool.query(query, values);
    if (result.rows.length === 0) throw new NotFoundError('${repo} not found');
    return result.rows[0];
  },
  async delete(id) {
    const result = await pool.query('DELETE FROM ${repo}s WHERE id = \$1 RETURNING *', [id]);
    if (result.rows.length === 0) throw new NotFoundError('${repo} not found');
    return result.rows[0];
  }
};
EOF
done

# Create all services
for svc in company vehicle driver customer consignment trip route warehouse expense report; do
cat > "$BASE/services/${svc}.service.js" << EOF
import { ${svc}Repository } from '../repositories/${svc}.repository.js';

export const ${svc}Service = {
  async create${svc^}(data) { return ${svc}Repository.create(data); },
  async getAll${svc^}s(filters) { return ${svc}Repository.findAll(filters); },
  async get${svc^}(id) { return ${svc}Repository.findById(id); },
  async update${svc^}(id, data) { return ${svc}Repository.update(id, data); },
  async delete${svc^}(id) { return ${svc}Repository.delete(id); }
};
EOF
done

# Create all controllers
for ctrl in company vehicle driver customer consignment trip route warehouse expense report; do
cat > "$BASE/controllers/${ctrl}.controller.js" << EOF
import { ${ctrl}Service } from '../services/${ctrl}.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = await ${ctrl}Service.create${ctrl^}(req.body);
  res.status(201).json({ success: true, data });
});

export const getAll = asyncHandler(async (req, res) => {
  const data = await ${ctrl}Service.getAll${ctrl^}s(req.query);
  res.json({ success: true, count: data.length, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const data = await ${ctrl}Service.get${ctrl^}(req.params.id);
  res.json({ success: true, data });
});

export const update = asyncHandler(async (req, res) => {
  const data = await ${ctrl}Service.update${ctrl^}(req.params.id, req.body);
  res.json({ success: true, data });
});

export const remove = asyncHandler(async (req, res) => {
  await ${ctrl}Service.delete${ctrl^}(req.params.id);
  res.json({ success: true, message: '${ctrl} deleted' });
});
EOF
done

# Create all routes
for route in company vehicle driver customer consignment trip route warehouse expense report; do
cat > "$BASE/routes/${route}.routes.js" << EOF
import express from 'express';
import * as ${route}Controller from '../controllers/${route}.controller.js';
const router = express.Router();
router.post('/', ${route}Controller.create);
router.get('/', ${route}Controller.getAll);
router.get('/:id', ${route}Controller.getOne);
router.put('/:id', ${route}Controller.update);
router.delete('/:id', ${route}Controller.remove);
export default router;
EOF
done

# Create health route
cat > "$BASE/routes/health.routes.js" << 'EOF'
import express from 'express';
import { pool } from '../config/database.js';
const router = express.Router();
router.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ success: true, service: 'Transport & Logistics API', status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ success: false, status: 'unhealthy', error: error.message });
  }
});
export default router;
EOF

echo "All services, controllers, and routes created successfully"
