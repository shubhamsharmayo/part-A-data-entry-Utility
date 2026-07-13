
import Assigndata from "../../models/assigndata.js";

const assignUser = async (req, res, next) => {
  const userTasks = req.body;

  try {
    const creationPromises = userTasks.map(async (task) => {
      const {
        userId,
        templeteId,
        fileId,
        max,
        min,
        moduleType,
        correctedFilePath,
        taskName,
        errorFilePath,
        imageDirectoryPath,
      } = task;
      await Assigndata.create({
        userId: userId,
        templateId: templeteId,
        fileId: fileId,
        max: max,
        min: min,
        taskName: taskName,
        currentIndex: 1,
        moduleType: "Data Entry",
        correctedCsvFilePath: correctedFilePath,
        errorFilePath: errorFilePath,
        imageDirectoryPath: imageDirectoryPath,
      });
    });
    await Promise.all(creationPromises);
    return res
      .status(200)
      .json({ success: true, message: "Users assigned successfully" });
  } catch (error) {
    console.error("Error assigning users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default assignUser;
