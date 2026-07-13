import Template from '../../models/template.js'
import Files from '../../models/filedata.js'
import sequelize from '../../utils/database.js';
import { QueryTypes } from 'sequelize';


const getTotalCsvDataController = async (req, res) => {
  try {
    const { templateId, fileId } = req.query;
    // console.log(req.query)

    if (!templateId) {
      return res
        .status(400)
        .json({ success: false, message: "Template ID is required" });
    }

    // Find template by ID
    const template = await Template.findByPk(templateId);
    const fileData = await Files.findByPk(fileId);
    // console.log(fileData)
    if (!template) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }
    const tableName = template.csvTableName;
    const startIndex = fileData.startIndex===1 ?fileData.startIndex : +fileData.startIndex +1;
    // const startIndex = fileData.startIndex;
    const [result] = await sequelize.query(
      `
      SELECT COUNT(*) AS count 
      FROM ${tableName}
      WHERE id >= ${startIndex}
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    return res.status(200).json({ success: true, totalRows: result.count });
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export default getTotalCsvDataController