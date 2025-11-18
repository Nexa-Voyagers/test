# Saree & Textile Store Management System - Backend API

Complete production-ready backend for Banarasi Saree and Textile Store management with GST billing and weaver management.

## Features

- **Product Catalog**: Complete Banarasi saree catalog with detailed specifications
- **Custom Orders**: Custom design and weaving order management
- **GST Billing**: Compliant GST billing and invoice generation
- **Weaver Management**: Track weavers, commissions, and production
- **Inventory Tracking**: Real-time stock management across multiple stores
- **Customer Management**: Customer database with purchase history
- **Sales & Returns**: Complete sales cycle management
- **Supplier Management**: Track suppliers and purchase orders
- **Reports & Analytics**: Sales reports, inventory reports, GST reports

## Tech Stack

- Node.js 20+ & Express.js
- PostgreSQL 15+
- JWT Authentication
- Swagger Documentation

## API Endpoints

### Products
- `GET /api/v1/products` - List all products
- `POST /api/v1/products` - Create product
- `GET /api/v1/products/:id` - Get product details

### Sales
- `GET /api/v1/sales` - List all sales
- `POST /api/v1/sales` - Create new sale
- `GET /api/v1/sales/:id/invoice` - Generate invoice

### Custom Orders
- `GET /api/v1/custom-orders` - List custom orders
- `POST /api/v1/custom-orders` - Create custom order

### Weavers
- `GET /api/v1/weavers` - List all weavers
- `POST /api/v1/weavers` - Add new weaver
- `GET /api/v1/weavers/:id/commissions` - Get weaver commissions

### Reports
- `GET /api/v1/reports/sales` - Sales reports
- `GET /api/v1/reports/inventory` - Inventory reports
- `GET /api/v1/reports/gst` - GST reports

## Installation

```bash
cd /home/user/test/varanasi-empire-solutions/09-SAREE-TEXTILE-STORE/backend
npm install
cp .env.example .env
npm run dev
```

## Scheduled Jobs

- **Low Stock Alert**: Every 6 hours - Alert for items below minimum stock
- **Daily Sales Report**: 11:59 PM - Generate daily sales summary

## GST Compliance

- Automatic GST calculation (5% for textiles)
- GST-compliant invoice generation
- GSTR-1 report generation
- HSN code management for sarees

## Product Categories

- Banarasi Silk Sarees
- Cotton Sarees
- Designer Sarees
- Dress Materials
- Fabric Rolls
- Custom Designs

## License

PROPRIETARY - Varanasi Empire Solutions

**Version**: 1.0.0
