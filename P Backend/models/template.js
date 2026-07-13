import { Sequelize } from "sequelize";
import sequelize from "../utils/database.js";

const Template = sequelize.define("templates", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

pageCount: {
    type: Sequelize.INTEGER,
  },

  typeOption: {
    type: Sequelize.JSON,
    defaultValue: [],
  },

  patternDefinition: {
    type: Sequelize.STRING,
  },
  blankDefination: {
    type: Sequelize.STRING,
  },

  mergedTableName: {
    type: Sequelize.STRING,
  },
  csvTableName: {
    type: Sequelize.STRING,
  },
  imageColName: {
    type: Sequelize.STRING,
  },
  imagePath: {
    type: Sequelize.STRING
  },
  rollNoCol: {
    type: Sequelize.STRING
  }
});

export default Template;
