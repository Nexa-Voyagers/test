import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food Production & Distribution API',
      version: '1.0.0',
      description: 'Comprehensive API for managing food production, quality control, cold chain monitoring, and distribution operations',
      contact: {
        name: 'API Support',
        email: 'support@foodproduction.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5015/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.foodproduction.com/api/v1',
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
      { name: 'Units', description: 'Production unit management' },
      { name: 'Products', description: 'Product catalog management' },
      { name: 'Recipes', description: 'Recipe and formulation management' },
      { name: 'Production', description: 'Production batch management' },
      { name: 'Quality', description: 'Quality control and testing' },
      { name: 'Distributors', description: 'Distributor network management' },
      { name: 'Orders', description: 'Distribution order management' },
      { name: 'Inventory', description: 'Raw material and finished goods inventory' },
      { name: 'Reports', description: 'Analytics and reporting' },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
