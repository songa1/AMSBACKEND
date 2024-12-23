
import {authDocs} from "./authDocs"
import { userDocs } from "./userDocs";
export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Test',
    version: '1.0.0',
    description: 'Test description',
  },
  servers: [
    {
      url: 'http://localhost:7000',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
  },
  
  paths: {
    ...authDocs,
    ...userDocs,
  },
};
