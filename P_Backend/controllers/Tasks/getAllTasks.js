
import Assigndata from "../../models/assigndata.js";

const getAllTasks = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await Assigndata.findAll({ where: { userId: id } });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getAllTasks;
