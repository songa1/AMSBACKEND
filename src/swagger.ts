import swaggerJSDoc  from "swagger-jsdoc";
import {swaggerDefinition}  from "../documentation/index";

const options = {
  swaggerDefinition,
  apis: [], 
};

export const specs = swaggerJSDoc(options);

