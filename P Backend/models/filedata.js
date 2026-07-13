
import Sequelize from "sequelize";
import sequelize from "../utils/database.js";

const Files = sequelize.define("filedata", {
    scannedCsvTable: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    scannedCsvFile: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    masterDataFile:{
        type: Sequelize.STRING,
        defaultValue: null,
    },
    absentCsvFile:{
        type: Sequelize.STRING,
        defaultValue: null,
    },

    zipFile: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    totalFiles: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    startIndex: {
        type: Sequelize.INTEGER,
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

export default Files;
