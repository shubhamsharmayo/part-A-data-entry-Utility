
import { where } from "sequelize";

import Assigndata from "../../models/assigndata.js";

import Template from "../../models/template.js";

import groupByPrimaryKey from "../../services/groupingCsvData.js";

import User from "../../models/User.js";

const assignedTask = async (req, res) => {
  try {
    const assignData = await Assigndata.findAll();

    const mappedAssignedData = await Promise.all(
      assignData.map(async (data) => {
        const { id, userId,taskName, templateId, max, min, taskStatus, moduleType } =
          data;
        const user = await User.findOne({ where: { id: userId } });
        const template = await Template.findOne({ where: { id: templateId } });

        return {
          userName: user.username,
          taskName: taskName,
          moduleType: moduleType,
          max,
          min,
          taskStatus,
          id,
          templateName:template.name,
        };
      })
    );
    res.status(200).send({
      message: " File found successfuly ",
      assignedData: mappedAssignedData,
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while retrieving the data",
      error: error.message,
    });
  }
};

export default assignedTask;
