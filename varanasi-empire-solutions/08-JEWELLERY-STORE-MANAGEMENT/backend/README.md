# Jewellery Store Management System - Backend API

Complete production-ready backend API for Jewellery Stores with gold, silver, diamond, and scheme management.

## Features

### Core Modules
- **Store Management**: Multi-store support, branch management, store settings
- **Product Management**: Product catalog with gold, silver, diamond, platinum items
- **Category Management**: Product categories (rings, necklaces, bangles, earrings, etc.)
- **Metal Rate Management**: Live gold/silver/platinum rates, rate history, auto-updates
- **Inventory Management**: Stock tracking with weight, purity, BIS hallmark, barcode
- **Customer Management**: Customer database, loyalty programs, gold schemes
- **Sales Management**: POS billing, making charges (per gram/percentage/fixed), GST invoicing
- **Old Gold Exchange**: Old gold acceptance, purity testing, valuation, exchange calculation
- **Repair & Customization**: Repair orders, custom design orders, job tracking
- **Scheme Management**: Gold saving schemes, installment tracking, maturity handling
- **BIS Hallmark**: Hallmark tracking, HUID (Hallmark Unique ID), compliance
- **Making Charges**: Flexible making charges (per gram, percentage of gold value, fixed amount)
- **Reports & Analytics**: Sales reports, inventory reports, scheme reports, customer reports

### Technical Features
- RESTful API, MVC + Service + Repository pattern
- PostgreSQL with 50+ tables
- JWT authentication, Role-based access control
- Live metal rate integration ready
- Weight & purity calculations
- GST billing with reverse calculation
- BIS hallmark compliance
- Multi-store support

## Tech Stack

- Node.js 20+, Express.js, PostgreSQL 14+
- JWT Authentication, Winston Logging
- Swagger/OpenAPI 3.0, node-cron

## API Endpoints

- `/api/v1/stores` - Store management
- `/api/v1/products` - Product catalog
- `/api/v1/categories` - Product categories
- `/api/v1/metal-rates` - Live metal rates
- `/api/v1/inventory` - Inventory with weight tracking
- `/api/v1/customers` - Customer management
- `/api/v1/sales` - Sales & billing
- `/api/v1/old-gold` - Old gold exchange
- `/api/v1/repairs` - Repair orders
- `/api/v1/schemes` - Gold saving schemes
- `/api/v1/reports` - Analytics & reports

## Key Features

### Metal Rate Management
- Live gold, silver, platinum rate updates
- Rate history tracking
- Custom rate margins per store
- Rate alert notifications

### Making Charges
- Per gram charges (e.g., ₹500/gram)
- Percentage of gold value (e.g., 15% of gold value)
- Fixed amount per item (e.g., ₹5000 for a ring)
- Combination of methods

### Old Gold Exchange
- Purity testing and verification
- Automatic valuation based on current rates
- Exchange value calculation
- Old gold inventory tracking

### Gold Saving Schemes
- Monthly installment schemes
- Flexible tenure options
- Interest-free schemes
- Maturity redemption

### BIS Hallmark
- HUID tracking
- Hallmark certificate management
- Compliance reporting
- Purity verification

## Installation

```bash
cd varanasi-empire-solutions/08-JEWELLERY-STORE-MANAGEMENT/backend
npm install
cp .env.example .env
npm run dev
```

## API Documentation

http://localhost:5003/api-docs

## License

Proprietary - Varanasi Empire Solutions

---

**Total Lines**: ~4,500+ lines
**Architecture**: MVC + Service + Repository
**Status**: Production Ready
