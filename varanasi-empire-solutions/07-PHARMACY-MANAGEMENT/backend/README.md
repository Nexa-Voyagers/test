# Pharmacy Management System - Backend API

Complete production-ready backend API for Pharmacy Management with drug inventory, prescriptions, sales, and compliance.

## Features

### Core Modules
- **Drug Management**: Drug catalog with generic/brand names, composition, dosage, schedule (H/H1/X/G)
- **Inventory Management**: Batch tracking, expiry management, stock levels, reorder alerts
- **Prescription Management**: Prescription validation, drug schedule compliance, doctor details
- **Sales Management**: POS billing, GST invoicing, payment modes, customer history
- **Purchase Management**: Purchase orders, supplier management, GRN, payment tracking
- **Batch & Expiry**: Batch-wise inventory, expiry alerts, FIFO/FEFO, return/exchange
- **Drug Schedule Compliance**: Schedule H/H1/X/G validation, prescription mandatory drugs
- **Supplier Management**: Supplier database, credit terms, purchase history
- **Customer Management**: Customer profiles, purchase history, loyalty programs
- **Reports & Analytics**: Sales reports, stock reports, expiry reports, GST reports

### Technical Features
- RESTful API, MVC + Service + Repository pattern
- PostgreSQL with 40+ tables
- JWT authentication, Role-based access control
- Batch/expiry tracking, Schedule compliance
- GST billing, FSSAI compliance ready
- Expiry & low stock alerts

## Tech Stack

- Node.js 20+, Express.js, PostgreSQL 14+
- JWT Authentication, Winston Logging
- Swagger/OpenAPI 3.0, node-cron

## API Endpoints

- `/api/v1/pharmacies` - Pharmacy management
- `/api/v1/drugs` - Drug catalog
- `/api/v1/categories` - Drug categories
- `/api/v1/inventory` - Inventory with batch tracking
- `/api/v1/prescriptions` - Prescription management
- `/api/v1/sales` - Sales & billing
- `/api/v1/purchases` - Purchase orders
- `/api/v1/suppliers` - Supplier management
- `/api/v1/customers` - Customer management
- `/api/v1/reports` - Analytics & reports

## Installation

```bash
cd varanasi-empire-solutions/07-PHARMACY-MANAGEMENT/backend
npm install
cp .env.example .env
npm run dev
```

## API Documentation

http://localhost:5002/api-docs

## License

Proprietary - Varanasi Empire Solutions

---

**Total Lines**: ~4,000+ lines
**Architecture**: MVC + Service + Repository
**Status**: Production Ready
