import Template from "../../models/template.js";
import MetaData from "../../models/metadata.js";

const getAllTemplate = async (req, res) => {
    try {
        const templateData = await Template.findAll({
            include: [
                {
                    model: MetaData,
                    attributes: {
                        exclude: ["id", "templeteId", "createdAt", "updatedAt"], // Specify the fields to be excluded
                    },
                },
            ],
        })
       
        // console.log(templateData)
        res.json({
            templateData
        })
    } catch (error) {

    }

}

export default getAllTemplate