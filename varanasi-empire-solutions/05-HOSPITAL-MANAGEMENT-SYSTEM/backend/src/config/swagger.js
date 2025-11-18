import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital Management System API',
      version: '1.0.0',
      description: 'Enterprise Hospital Information System (HIS) API Documentation',
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
        url: `http://localhost:${process.env.PORT || 5001}/api/${process.env.API_VERSION || 'v1'}`,
        description: 'Development server',
      },
      {
        url: 'https://api.hospital.com/api/v1',
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
      { name: 'Hospital', description: 'Hospital management' },
      { name: 'Department', description: 'Department management' },
      { name: 'Doctor', description: 'Doctor management' },
      { name: 'Patient', description: 'Patient management' },
      { name: 'Appointment', description: 'Appointment scheduling' },
      { name: 'OPD', description: 'Outpatient department' },
      { name: 'IPD', description: 'Inpatient department' },
      { name: 'Lab', description: 'Laboratory management' },
      { name: 'Pharmacy', description: 'Pharmacy management' },
      { name: 'Billing', description: 'Billing and payments' },
      { name: 'Report', description: 'Reports and analytics' },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
