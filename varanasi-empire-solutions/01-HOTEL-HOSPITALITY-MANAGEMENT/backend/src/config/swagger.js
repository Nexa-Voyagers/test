import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger documentation configuration
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Management System API',
      version: '1.0.0',
      description: 'Complete Hotel & Hospitality Management System Backend API',
      contact: {
        name: 'Varanasi Empire Solutions',
        email: 'support@varanasi-empire.com',
      },
      license: {
        name: 'Proprietary',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.hotelmanagement.com/api/v1',
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
  },
  apis: ['./src/routes/*.js'],
};

/**
 * Swagger specification
 */
export const swaggerSpec = swaggerJsdoc(options);
