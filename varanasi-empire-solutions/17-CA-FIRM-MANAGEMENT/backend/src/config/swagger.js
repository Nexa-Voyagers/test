import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management System API',
      version: '1.0.0',
      description: 'Comprehensive School Management System (SIS) for CBSE, ICSE, and UP Board Schools',
      contact: {
        name: 'Varanasi Empire Solutions',
        email: 'school@varanasi-empire.com',
      },
      license: {
        name: 'Proprietary',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/${process.env.API_VERSION || 'v1'}`,
        description: 'Development server',
      },
      {
        url: 'https://api.school-management.com/api/v1',
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
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
