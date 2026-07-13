import Template from "../../models/template.js"
import MetaData from "../../models/metadata.js"


const templateDataById = async (req, res) => {
    const templateId = req.params.id
    // console.log(templateId)
    const templateData = await Template.findByPk(templateId, {
        include: [
            {
                model: MetaData,
                attributes: {
                    exclude: ["templeteId", "createdAt", "updatedAt"], // Specify the fields to be excluded
                },
            },
        ],
    })
    
    res.json({
        templateData
    })
}

export default templateDataById