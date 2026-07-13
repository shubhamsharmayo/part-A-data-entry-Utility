
import Sequelize from "sequelize";

import sequelize from "../utils/database.js";

const MappedData = sequelize.define("mappeddata", {
    key: {
        type: Sequelize.STRING,
    },
    value: {
        type: Sequelize.STRING,
    },

    templateId: {
        type: Sequelize.INTEGER,
        references: {
            model: "templates", // 'Templete' refers to the table name
            key: "id",
        },
    },
});

export default MappedData;
