
import sequelize from "../../utils/database.js";

import { QueryTypes } from 'sequelize'

import Template from "../../models/template.js";

const getCsvHeaderController = async (req, res) => {
    try {
        const  templateId  = req.params.id;
         console.log("templateId:", templateId);

        // Find the template by ID
        const template = await Template.findByPk(templateId);
        if (!template) {
            return res
                .status(404)
                .json({ success: false, message: "Template not found" });
        }

        const tableName = template.csvTableName;
        console.log(tableName)

        // Query to get column names from the database schema
        const columns = await sequelize.query(
            `SHOW COLUMNS FROM \`${tableName}\`;`,
            { type: QueryTypes.SELECT }
        );

        // Extract column names
        const headers = columns.map((col) => col.Field);

        return res.json({ success: true, headers });
    } catch (error) {
        console.error("Error fetching CSV headers:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export default getCsvHeaderController;
