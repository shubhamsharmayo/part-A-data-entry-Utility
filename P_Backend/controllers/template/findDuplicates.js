import Template from "../../models/template.js";
import sequelize from "../../utils/database.js";
import { QueryTypes } from "sequelize";

// Finds duplicate Roll Numbers inside a template's scanned-CSV table.
// The Roll No column name (rollNoCol) and the CSV table name (csvTableName)
// are both already saved on the Template row when the admin uploaded the
// CSV files, so nothing is hardcoded here.
const findDuplicatesController = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findByPk(id);
    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }

    const tableName = template.csvTableName;
    const rollNoCol = template.rollNoCol;

    if (!tableName || !rollNoCol) {
      return res.status(400).json({
        success: false,
        message: "CSV table or Roll No column is not set for this template",
      });
    }

    // Step 1: find which roll numbers appear more than once.
    // We deliberately EXCLUDE blank values and placeholder markers
    // (empty string, "*", "**", ...) because those represent
    // unread/unscanned entries, not genuine duplicate roll numbers.
    const duplicateRollNumbers = await sequelize.query(
      `SELECT \`${rollNoCol}\` AS rollNo, COUNT(*) AS count
       FROM \`${tableName}\`
       WHERE TRIM(\`${rollNoCol}\`) != ''
         AND \`${rollNoCol}\` NOT REGEXP '^\\\\*+$'
       GROUP BY \`${rollNoCol}\`
       HAVING COUNT(*) > 1`,
      { type: QueryTypes.SELECT }
    );

    if (duplicateRollNumbers.length === 0) {
      return res
        .status(200)
        .json({ success: true, rollNoCol, duplicateGroups: [] });
    }

    const rollNoList = duplicateRollNumbers.map((row) => row.rollNo);

    // Step 2: fetch the FULL rows for those duplicate roll numbers
    const allRows = await sequelize.query(
      `SELECT * FROM \`${tableName}\` WHERE \`${rollNoCol}\` IN (:rollNoList)`,
      {
        replacements: { rollNoList },
        type: QueryTypes.SELECT,
      }
    );

    // Step 3: group the rows under their roll number
    const duplicateGroups = duplicateRollNumbers.map((dup) => {
      const rows = allRows.filter((row) => row[rollNoCol] === dup.rollNo);
      return {
        rollNo: dup.rollNo,
        count: dup.count,
        rows,
      };
    });

    return res
      .status(200)
      .json({ success: true, rollNoCol, duplicateGroups });
  } catch (error) {
    console.error("Error finding duplicates:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default findDuplicatesController;
