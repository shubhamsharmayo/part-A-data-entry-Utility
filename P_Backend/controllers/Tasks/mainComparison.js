import csvToJson from "../../services/csvToJson.js";
import Assigndata from "../../models/assigndata.js";
import Files from "../../models/filedata.js";
import sequelize from "../../utils/database.js";

import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import Template from "../../models/template.js";
import { DataTypes, QueryTypes, Op } from "sequelize";
import MetaData from "../../models/metadata.js";
import MappedData from "../../models/mappedData.js";
import getAllDirectories from "../../services/directoryFinder.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);






async function createDynamicTable(headers) {
  const tableName = `assign_${Date.now()}`; // Unique table name
  const columns = {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, // Explicitly set primary key
  };

  headers.forEach((header) => {
    const normalizedHeader = header;

    // Assign appropriate data types based on column content
    if (
      normalizedHeader.toLowerCase().includes("image") ||
      normalizedHeader.toLowerCase().includes("details") ||
      normalizedHeader.toLowerCase().includes("values") ||
      normalizedHeader.toLowerCase().includes("updated_col")
    ) {
      columns[normalizedHeader] = { type: DataTypes.TEXT }; // Large text-based columns
    } else if (normalizedHeader.toLowerCase().includes("barcode")) {
      columns[normalizedHeader] = { type: DataTypes.TEXT('long') }; // Reduce barcode size
    } else if (normalizedHeader.match(/^q[0-9]+$/i)) {
      columns[normalizedHeader] = { type: DataTypes.TEXT('long') }; // Short answers (e.g., A, B, C, D, etc.)
    } else {
      columns[normalizedHeader] = { type: DataTypes.TEXT('long') }; // Default reduced VARCHAR size
    }
  });

  const DynamicModel = sequelize.define(tableName, columns, {
    timestamps: false,
  });

  await DynamicModel.sync();
  // Extract the actual table name from the model
  const actualTableName = DynamicModel.getTableName();
  return { tableName: actualTableName, DynamicModel };
}

// Function to read CSV files and insert into the dynamic table
async function processAndInsertCSV(mergedRecords) {
  if (!mergedRecords || mergedRecords.length === 0) {
    throw new Error("No valid data found in the merged CSV data.");
  }

  // Collect all unique headers from the merged data
  let allHeaders = new Set();
  mergedRecords.forEach((record) => {
    Object.keys(record).forEach((key) => allHeaders.add(key));
  });

  const headersArray = Array.from(allHeaders);
  headersArray.push("Corrected");
  headersArray.push("Corrected_By");

  const { tableName, DynamicModel } = await createDynamicTable(headersArray);

  // Ensure each record has all headers
  const formattedRecords = mergedRecords.map((record) => {
    let formattedRecord = {};
    headersArray.forEach((header) => {
      formattedRecord[header] = record[header] ?? null; // Fill missing columns with null
    });
    return formattedRecord;
  });

  await DynamicModel.bulkCreate(formattedRecords);

  return { tableName, headersArray };
}







const mainComparison = async (req, res) => {

  const { id } = req.params


  const assignData = await Assigndata.findByPk(id)

  const fileData = await Files.findByPk(assignData.fileId)
  const { scannedCsvTable, scannedCsvFile, masterDataFile, absentCsvFile, templateId, startIndex } = fileData
  // console.log(fileData)
  const { rollNoCol, patternDefinition, blankDefination, csvTableName, imageColName } = await Template.findByPk(templateId)
  // console.log(rollNoCol)



  const columns = await MappedData.findAll({
    where: {
      templateId: templateId,
      [Op.and]: [
        { value: { [Op.ne]: null } }, // not NULL
        { value: { [Op.ne]: "" } }, // not blank
      ],
    },
    attributes: ["key", "value"],
  });

  // console.log(columns)

  const metaData = await MetaData.findAll({
    where: {
      templateId: templateId,
    },
  });
  // console.log(metaData);

  // Optimized column filtering
  const formFieldValues = new Set(
    metaData
      .filter((meta) => meta.fieldType === "formfield")
      .map((meta) => meta.attribute)
  );

  // console.log(formFieldValues)

  const questionFieldValues = new Set(
    metaData
      .filter((meta) => meta.fieldType === "questionfield")
      .map((meta) => meta.attribute)
  );

  // console.log(questionFieldValues)

  const FormCol = columns
    .filter((col) => formFieldValues.has(col.value))
    .map((col) => col.key);
  // console.log(FormCol)

  const QuestionCol = columns
    .filter((col) => questionFieldValues.has(col.value))
    .map((col) => col.key);

  // console.log(QuestionCol)

  if (!columns.length) {
    return res
      .status(404)
      .json({ success: false, error: "No relevant columns found" });
  }


  if (assignData.tableName) {
    let indexToSearch = assignData.currentIndex;
    // console.log(scanned)
    // if (currentIndex == min) {
    //   // const query = `SELECT id FROM \`${assignData.tableName}\` WHERE parentId >= ${min} ORDER BY parentId ASC LIMIT 1`;
    //   // const [countId] = await sequelize.query(query, {
    //   //   type: sequelize.QueryTypes.SELECT,
    //   // });
    //   // indexToSearch = countId.id;
    //   // assignData.currentIndex = indexToSearch;
    //   // await assignData.save();
    // }

    try {
      const template = await Template.findByPk(templateId);
      const maintable = template.csvTableName;
      const query = `SELECT * FROM \`${assignData.tableName}\` WHERE id = :indexToSearch`;
      const [result] = await sequelize.query(query, {
        replacements: { indexToSearch },
        type: sequelize.QueryTypes.SELECT, // Ensures SELECT query type
      });
      console.log(result)


      const countQuery = `SELECT COUNT(*) as total FROM \`${assignData.tableName}\``;

      const [countResult] = await sequelize.query(countQuery, {
        type: sequelize.QueryTypes.SELECT,
      });
      const parentId = result.parentId;
      const querytwo = `SELECT * FROM \`${maintable}\` WHERE id = :parentId`;

      const [resultTwo] = await sequelize.query(querytwo, {
        replacements: { parentId },
        type: sequelize.QueryTypes.SELECT, // Ensures SELECT query type
      });

      // console.log(resultTwo)
      const imageName = resultTwo[imageColName];
      const baseName = path.basename(imageName);
      // console.log(baseName);
      const formData = {};
      const questionData = {};

      const dirs = getAllDirectories(
        path.join(__dirname, "../", "../", "extractedFiles", fileData.zipFile)
      );
      const joinstr = dirs.join("/");

      const maindir = path.join(fileData.zipFile, joinstr, baseName);

      Object.entries(resultTwo).forEach(([key, value]) => {
        if (FormCol.includes(key)) {
          formData[key] = value;
        }
        if (QuestionCol.includes(key)) {
          questionData[key] = value;
        }
      });
      return res.status(200).json({
        success: true,
        formdata: formData,
        questionData: questionData,
        total_error: countResult.total,
        imageName: maindir,
        currentIndex: assignData.currentIndex,
        id: result.parentId,
        reason: result.reason,
        absentflag: parseInt(result.absentflag),
        NotInMasterData: parseInt(result.NotInMasterData),
        blank: parseInt(result.Blank)
      });
    } catch (error) {
      console.error("Error executing query:", error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error" });
    }
  }



  let formField = [...FormCol]
  const index = formField.indexOf(rollNoCol);

  if (index !== -1) {
    formField.splice(index, 1);
  }




  const tableQuery = `SELECT * FROM ${scannedCsvTable}`
  const tableData = await sequelize.query(tableQuery)
  // res.json(tableData[0])


  //  const scanned = await csvToJson("D:/Part A Data Entry Utility/P Backend/csvUploads/Paper_1_Part_A_.csv");
  const scanned = tableData[0]
  // res.json(scanned)

  const attendance = await csvToJson(path.join(__dirname, '../../csvUploads', absentCsvFile));
  const master = await csvToJson(path.join(__dirname, '../../csvUploads', masterDataFile));

  const attendanceSet = new Set(
    attendance.map(r => String(r[rollNoCol]).trim())
  );

  const masterSet = new Set(
    master.map(r => String(r[rollNoCol]).trim())
  );

  const result = [];

  for (const row of scanned) {
    const roll = String(row[rollNoCol]).trim();

    // Roll number contains *
    if (roll.includes(patternDefinition)) {
      result.push({
        Reason: `Roll contains ${patternDefinition}`,
        ...row
      });
      continue;
    }

    // Not in Master Data
    if (!masterSet.has(roll)) {
      result.push({
        Reason: "Not Found in Master Data",
        ...row
      });
      continue;
    }

    // Found in Attendance
    if (attendanceSet.has(roll)) {
      result.push({
        Reason: "Found in Absent",
        ...row
      });
    }


    for (const element of formField) {
      if (row[element].includes(patternDefinition)) {
        result.push({
          Reason: `${element} has ${patternDefinition}`,
          ...row
        })
        break
      }
    }

  }

  console.log(result.length);



  const query = `
      SELECT * FROM \`${csvTableName}\`
      WHERE id BETWEEN :min AND :max`;

  const filteredData = await sequelize.query(query, {
    replacements: {
      min:
        Number(startIndex) === 1
          ? Number(assignData.min)
          : Number(assignData.min) + Number(startIndex),
      max:
        Number(startIndex) === 1
          ? Number(assignData.max)
          : Number(assignData.max) + Number(startIndex),

    },
    type: sequelize.QueryTypes.SELECT,
  });
  // res.json(result)

  const filteredResult = filteredData.map(({ id }) => {
    const rs = result.find(item => item.id === id);

    return {
      parentId: id,
      reason: rs?.Reason || null, // if result has a Reason field
      absentflag: false,
      NotInMasterData: false,
      Blank: false,
    };
  });


  const assignedTableName = await processAndInsertCSV(filteredResult);
  console.log(assignedTableName)
  assignData.tableName = assignedTableName.tableName
  await assignData.save()








  const indexToSearch = 1
  try {
    const template = await Template.findByPk(templateId);
    const maintable = template.csvTableName;
    const query = `SELECT * FROM \`${assignData.tableName}\` WHERE id = :indexToSearch`;
    const [result] = await sequelize.query(query, {
      replacements: { indexToSearch },
      type: sequelize.QueryTypes.SELECT, // Ensures SELECT query type
    });

    console.log(result)
    const countQuery = `SELECT COUNT(*) as total FROM \`${assignData.tableName}\``;
    const [countResult] = await sequelize.query(countQuery, {
      type: sequelize.QueryTypes.SELECT,
    });
    const parentId = result.parentId;
    const querytwo = `SELECT * FROM \`${maintable}\` WHERE id = :parentId`;

    const [resultTwo] = await sequelize.query(querytwo, {
      replacements: { parentId },
      type: sequelize.QueryTypes.SELECT, // Ensures SELECT query type
    });

    // console.log(resultTwo)
    const imageName = resultTwo[imageColName];
    const baseName = path.basename(imageName);

    const formData = {};
    const questionData = {};

    const dirs = getAllDirectories(
      path.join(__dirname, "../", "../", "extractedFiles", fileData.zipFile)
    );
    const joinstr = dirs.join("/");

    const maindir = path.join(fileData.zipFile, joinstr, baseName);

    Object.entries(resultTwo).forEach(([key, value]) => {
      if (FormCol.includes(key)) {
        formData[key] = value;
      }
      if (QuestionCol.includes(key)) {
        questionData[key] = value;
      }
    });
    return res.status(200).json({
      success: true,
      formdata: formData,
      questionData: questionData,
      total_error: countResult.total,
      imageName: maindir,
      currentIndex: assignData.currentIndex,
      id: result.parentId,
      reason: result.reason,
      absentflag: parseInt(result.absentflag),
      NotInMasterData: parseInt(result.NotInMasterData),
      blank: parseInt(result.Blank)
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }

}

export default mainComparison