
import { where } from "sequelize";
import Assigndata from "../../models/assigndata.js";
const submitTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!taskId) {
            throw new Error("Task Id is empty ");
        }
        const data = await Assigndata.findOne({ where: { id: taskId } });
        if (data) {
            data.taskStatus = true;
            await data.save();
            res.status(201).json({ message: "Save the status successfully" })
        } else {
            throw new Error("Task not found");
        }

        data.taskStatus = true;
        data.save()

    } catch (error) {
        res.status(404).json({ message: error })
    }
}

export default submitTask