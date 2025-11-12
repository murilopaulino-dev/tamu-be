import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import swaggerUi from 'swagger-ui-express';
import logger from "../src/middlewares/logger";
import sequelize from './config/database';
import { initializeDefaultUsers } from './config/defaultUsers';
import swaggerSpec from './config/swagger';
import { PORT } from './constants/config';
import "./models";
import { configureRoutes } from "./routes";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

logger(app);

app.use('/api-docs', swaggerUi.serve as any, swaggerUi.setup(swaggerSpec) as any);

configureRoutes(app)

app.use('/api/products/images', express.static('./products-images'));

sequelize.sync().then(async () => {
  await initializeDefaultUsers();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
