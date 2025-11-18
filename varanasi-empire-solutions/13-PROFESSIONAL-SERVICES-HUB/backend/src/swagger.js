import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Real Estate Management API',
      version: '1.0.0',
      description: 'RESTful API for Real Estate Management System with UP RERA Compliance',
      contact: {
        name: 'Varanasi Empire Solutions',
        email: 'support@varanasi-empire.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5006}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api.realestate.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Agencies', description: 'Real estate agency management' },
      { name: 'Agents', description: 'Agent management' },
      { name: 'Properties', description: 'Property listings and management' },
      { name: 'Owners', description: 'Property owner management' },
      { name: 'Customers', description: 'Customer/buyer management' },
      { name: 'Enquiries', description: 'Lead and enquiry management' },
      { name: 'Visits', description: 'Site visit scheduling' },
      { name: 'Deals', description: 'Deal and transaction management' },
      { name: 'Commissions', description: 'Commission tracking' },
      { name: 'Reports', description: 'Analytics and reports' },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
