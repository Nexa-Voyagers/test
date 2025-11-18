import swaggerJsdoc from 'swagger-jsdoc';
const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'ARTS CRAFTS STUDIO API', version: '1.0.0', description: 'Complete API for ARTS CRAFTS STUDIO management' },
    servers: [{ url: 'http://localhost:5021/api/v1', description: 'Development' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer' } } },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js']
};
export const swaggerSpec = swaggerJsdoc(options);
