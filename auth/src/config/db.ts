import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create a new Sequelize instance using environment variables
const sequelize = new Sequelize(
  process.env.AUTH_POSTGRES_DB as string,
  process.env.AUTH_POSTGRES_USER as string,
  process.env.AUTH_POSTGRES_PASSWORD as string,
  {
    host: process.env.AUTH_POSTGRES_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.AUTH_POSTGRES_PORT as string),
    logging: false,
  },
);

export default sequelize;
