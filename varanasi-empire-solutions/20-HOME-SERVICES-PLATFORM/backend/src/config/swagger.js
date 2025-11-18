import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'HOME SERVICES PLATFORM API', version: '1.0.0', description: 'Complete API for HOME SERVICES PLATFORM management' },
    servers: [{ url: 'http://localhost:5020/api/v1', description: 'Development' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } } },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};
export const swaggerSpec = swaggerJsdoc(options);
