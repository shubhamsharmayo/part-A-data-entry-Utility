import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadPath = "csvUploads";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const csvMimeTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const rarMimeTypes = [
    "application/vnd.rar",
    "application/x-rar-compressed",
    "application/octet-stream",
  ];

  if (
    file.fieldname === "overallCsv" ||
    file.fieldname === "absentCsv" ||
    file.fieldname === "scannedCsv"
  ) {
    if (
      csvMimeTypes.includes(file.mimetype) ||
      path.extname(file.originalname).toLowerCase() === ".csv"
    ) {
      return cb(null, true);
    }

    return cb(new Error(`${file.fieldname} must be a CSV file.`));
  }

  if (file.fieldname === "rarFile") {
    if (
      rarMimeTypes.includes(file.mimetype) ||
      path.extname(file.originalname).toLowerCase() === ".rar"
    ) {
      return cb(null, true);
    }

    return cb(new Error("RAR file is required."));
  }

  cb(new Error("Unexpected file field."));
};

const csvUploader = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

export default csvUploader;