
import fs from "fs-extra";
import csvToJson from '../../services/csvToJson.js'
import sequelize from '../../utils/database.js'
import { DataTypes, Op, QueryTypes } from "sequelize";
import Template from '../../models/template.js'
import { Json } from "sequelize/lib/utils";
import Files from '../../models/filedata.js'
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import { createExtractorFromFile } from "node-unrar-js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function insertDataIntoTable(tableName, data, batchSize = 500) {
  if (!data || data.length === 0) return;

  // Step 1: Normalize column names and trim spaces
  const normalizedData = data.map((row) => {
    const normalizedRow = {};
    Object.keys(row).forEach((key) => {
      const trimmedKey = key.trim();
      normalizedRow[trimmedKey] = row[key];
    });
    return normalizedRow;
  });

  // Step 2: Get column names from the first row
  const columnsForRead = Object.keys(normalizedData[0]);
  const columns = columnsForRead.map((col) => `\`${col}\``);

  // Step 3: Insert in batches
  for (let i = 0; i < normalizedData.length; i += batchSize) {
    const batch = normalizedData.slice(i, i + batchSize);

    // Build batch VALUES SQL
    const values = batch
      .map(
        (row) =>
          `(${columnsForRead
            .map((col) => {
              let val = row[col] ?? "";

              // Convert to string & escape characters safely
              if (typeof val === "string") {
                val = val
                  .trim()
                  .replace(/\\/g, "\\\\") // Escape backslashes
                  .replace(/'/g, "\\'"); // Escape single-quotes
              }

              return `'${val}'`;
            })
            .join(",")})`
      )
      .join(",");

    const query = `INSERT INTO \`${tableName}\` (${columns.join(
      ","
    )}) VALUES ${values};`;

    // Execute batch insert
    await sequelize.query(query, { type: QueryTypes.INSERT });

    // console.log(`Inserted batch: ${i} → ${i + batch.length}`);
  }

  return columnsForRead;
}


async function createDynamicTable(headers, type) {
  let tableName
  if (type === "master") {
    tableName = `Master_${Date.now()}`
  } else if (type === "scanned") {
    tableName = `Table_${Date.now()}`; // Unique table name

  } else {
    tableName = `Absent_${Date.now()}`
  }
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
      columns[normalizedHeader] = { type: DataTypes.STRING(100) }; // Reduce barcode size
    } else if (normalizedHeader.match(/^q[0-9]+$/i)) {
      columns[normalizedHeader] = { type: DataTypes.STRING(10) }; // Short answers (e.g., A, B, C, D, etc.)
    } else {
      columns[normalizedHeader] = { type: DataTypes.STRING(100) }; // Default reduced VARCHAR size
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



async function mergeCSVFiles(fileNames) {
  let headersSet = new Set(); // Stores headers from the first file
  let mergedRecords = [];
  let firstFileHeaders = null;
  // console.log(__dirname)
  for (const [index, fileName] of fileNames.entries()) {
    const filePath = path.join(__dirname, "../../csvUploads/", fileName);

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File not found - ${filePath}`);
      continue;
    }

    try {
      await new Promise((resolve, reject) => {
        let rowIndex = 0; // Row counter

        fs.createReadStream(filePath)
          .pipe(csv())
          .on("headers", (headers) => {
            if (index === 0) {
              // Capture headers only from the first file
              firstFileHeaders = headers;
              headersSet = new Set(headers);
            }
          })
          .on("data", (row) => {
            rowIndex++; // Increment row count

            let formattedRow = {};

            // Only keep columns that exist in the first file
            if (firstFileHeaders) {
              firstFileHeaders.forEach((header) => {
                formattedRow[header] = row[header] ?? null; // Fill missing values with null
              });
            }

            mergedRecords.push(formattedRow);
          })
          .on("end", resolve)
          .on("error", reject);
      });
    } catch (error) {
      console.error(`Error processing file ${fileName}:`, error.message);
    }
  }

  return mergedRecords;
}



async function extractZipFile(finalFilePath, destinationFolderPath) {
  // Ensure destination folder exists
  await fs.ensureDir(destinationFolderPath);

  // Check if the uploaded file is a ZIP file
  const fileExtension = path.extname(finalFilePath).toLowerCase();
  if (fileExtension === ".rar") {
    try {
      const extractor = await createExtractorFromFile({
        filepath: finalFilePath,
        targetPath: destinationFolderPath,
      });
      const files = [...extractor.extract().files];
      return { success: true, files };
    } catch (err) {
      console.error("Extraction failed:", err);
      return { success: false, error: err };
    }
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(finalFilePath)
      .pipe(unzipper.Extract({ path: destinationFolderPath }))
      .on("close", resolve)
      .on("error", (err) => {
        console.error("Extraction error:", err);
        reject(
          new Error("Error during ZIP extraction. Make sure the file is valid.")
        );
      });
  });
}



function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}


const saveImageAndRollCol = async (id, imageName, rollNo, tableName) => {
  const template = await Template.findByPk(id)
  template.imageColName = imageName
  template.rollNoCol = rollNo
  template.csvTableName = tableName
  await template.save()
  return template
}


const fileDataFn = async (id, savedtable, scannedcsv, absentcsv, mastercsv, imagerar, datalength) => {

}

const csvAndImageUpload = async (req, res) => {
  try {
    // const data = await csv().fromFile(req.files.scannedCsv[0].path);
    console.log(req.files)
    const templateData = JSON.parse(req.body.selectedTemplate)
    console.log(templateData)
    const data = await csvToJson(req.files.scannedCsv[0].path)
    const absentCsvData = await csvToJson(req.files.absentCsv[0].path)
    const masterCsvData = await csvToJson(req.files.overallCsv[0].path)
    const imageRarData = await csvToJson(req.files.rarFile[0].path)
    const scannedCsv = req.files.scannedCsv[0]
    const absentCsv = req.files.absentCsv[0]
    const masterCsv = req.files.overallCsv[0]
    const imageRar = req.files.rarFile[0]
    // console.log(imageRar)

    const { id } = templateData
    const { imageName, rollCol } = req.body

    const timestamp = Math.floor(Date.now() / 1000);

    let fileData

    fileData = await Files.findOne({ where: { templateId: templateData.id } })

    // if(fileData){
    //   return res.status(409).json({
    //     message: "Data already assigned to this template"
    //   })
    // }
    // create dynamic table 
    const col = Object.keys(data[0])
    const masterCol = Object.keys(masterCsvData[0])
    const absentCol = Object.keys(absentCsvData[0])
    // console.log(col);
    const { tableName, DynamicModel } = await createDynamicTable(col, "scanned")
    const masterTable = await createDynamicTable(masterCol, "master")
    const absentTable = await createDynamicTable(masterCol, "absent")

    // save tablename in template data

    const savedData = saveImageAndRollCol(id, imageName, rollCol, tableName)
    // console.log(savedData)

    // divide the data from csv into chunks and store the data in chunks
    const chunkdata = chunkArray(data, 500)
    const masterChunks = chunkArray(masterCsvData, 500)
    const absentChunks = chunkArray(absentCsvData, 500)
    // console.log(chunkdata.length)

    for (let i = 0; i < chunkdata.length; i++) {
      insertDataIntoTable(tableName, chunkdata[i])
    }
    for (let i = 0; i < masterChunks.length; i++) {
      insertDataIntoTable(masterTable.tableName, masterChunks[i])
    }
    for (let i = 0; i < absentChunks.length; i++) {
      insertDataIntoTable(absentTable.tableName, absentChunks[i])
    }
    const mergedData = await mergeCSVFiles([req.files.scannedCsv[0].filename])

    console.log(mergedData.length);

    const finalFilePath = path.join(__dirname, "../../csvUploads", imageRar.filename)

    const destinationFolderPath = path.join(
      __dirname,
      "../../extractedFiles",
      `${timestamp}_${imageRar.originalname}`
    );


    await extractZipFile(finalFilePath, destinationFolderPath);

    fileData = await Files.create({
      scannedCsvTable: tableName,
      masterTable: masterTable.tableName,
      absentTable:absentTable.tableName,
      scannedCsvFile: scannedCsv.filename,
      masterDataFile: masterCsv.filename,
      absentCsvFile: absentCsv.filename,
      zipFile: `${timestamp}_${imageRar.originalname}`,
      startIndex: 1,
      totalFiles: mergedData.length,
      templateId: templateData.id
    })

    // console.log(DynamicModel);
    // console.log(req.body)
    // console.log(JSON.parse(req.body.selectedTemplate))

    res.status(200).json({
      message: "Table Created",
      fileData
    })
  } catch (error) {
    console.log(error);
  }

}

export default csvAndImageUpload