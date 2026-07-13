import Sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config();

const sequelize = new Sequelize(
  process.env.SQL_DATABASE_NAME,
  process.env.SQL_USER,
  process.env.SQL_PASS,
  {
    dialect: "mysql",
    host: process.env.SQL_HOST || "localhost", // Optional if always localhost
    logging: false,
    timezone: "+05:30",
  }
);

export default sequelize;