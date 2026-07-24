import sequelize from "../utils/database.js";

export function isPlaceholderRollNo(value) {
  const trimmed = String(value ?? "").trim();
  if (trimmed === "") return true;
  if (/^\*+$/.test(trimmed)) return true;
  return false;
}

export async function checkIsDuplicateRollNo(rollNoValue, tableName, rollNoCol) {
  if (isPlaceholderRollNo(rollNoValue)) return false;

  const dupQuery = `SELECT COUNT(*) as cnt FROM \`${tableName}\` WHERE \`${rollNoCol}\` = :rollNoValue`;
  const [dupResult] = await sequelize.query(dupQuery, {
    replacements: { rollNoValue },
    type: sequelize.QueryTypes.SELECT,
  });

  return Number(dupResult.cnt) > 1;
}