import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Transport & Logistics API',
      version: '1.0.0',
      description: 'Comprehensive API for managing transport companies, fleet, drivers, shipments, and GPS tracking',
    },
    servers: [
      { url: 'http://localhost:5016/api/v1', description: 'Development server' },
      { url: 'https://api.transport-logistics.com/api/v1', description: 'Production server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Companies', description: 'Transport company management' },
      { name: 'Vehicles', description: 'Fleet management' },
      { name: 'Drivers', description: 'Driver management' },
      { name: 'Customers', description: 'Customer management' },
      { name: 'Consignments', description: 'Shipment tracking' },
      { name: 'Trips', description: 'Trip management' },
      { name: 'Routes', description: 'Route optimization' },
      { name: 'Warehouses', description: 'Warehouse management' },
      { name: 'Expenses', description: 'Expense tracking' },
      { name: 'Reports', description: 'Analytics and reporting' },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
