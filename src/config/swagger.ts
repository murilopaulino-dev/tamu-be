import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API Documentation',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;