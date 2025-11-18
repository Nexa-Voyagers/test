import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'LAUNDRY DRY CLEANING API', version: '1.0.0', description: 'Complete API for LAUNDRY DRY CLEANING management' },
    servers: [{ url: 'http://localhost:5019/api/v1', description: 'Development' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } } },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};
export const swaggerSpec = swaggerJsdoc(options);
