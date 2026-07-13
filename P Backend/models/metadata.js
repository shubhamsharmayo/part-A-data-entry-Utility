import { Sequelize } from "sequelize";

import sequelize from "../utils/database.js";
import Templete from "./template.js";
const MetaData = sequelize.define("templetedata", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  attribute: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coordinateX: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coordinateY: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  width: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  height: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  fieldType: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  dataFieldType: {
    type: Sequelize.STRING,
  },

  pageNo: {
    type: Sequelize.INTEGER,
    // allowNull: false,
  },

  fieldRange: {
    type: Sequelize.STRING,
  },

  fieldLength: {
    type: Sequelize.STRING,
  },
  pattern:{
     type: Sequelize.BOOLEAN,
  },
  blank:{
     type: Sequelize.BOOLEAN,
  },
  empty:{
     type: Sequelize.BOOLEAN,
  },

  templateId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "templates", // 'Templete' refers to the table name
      key: "id",
    },
  },
});



export default MetaData;
