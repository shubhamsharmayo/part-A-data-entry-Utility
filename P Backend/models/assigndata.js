
import Sequelize from "sequelize";
import sequelize from "../utils/database.js";

const Assigndata = sequelize.define("assigndata", {

  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  templateId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fileId: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  max: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  min: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  taskStatus: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  taskName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  csvFilePath : {
      type : Sequelize.STRING,
    },
  moduleType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  errorFilePath: {
    type: Sequelize.STRING,
  },
  correctedCsvFilePath: {
    type: Sequelize.STRING,
  },
  imageDirectoryPath: {
    type: Sequelize.STRING,
  },
  currentIndex: {
    type: Sequelize.INTEGER,
  },
  tableName:{
    type: Sequelize.STRING,
  }
});

export default Assigndata;