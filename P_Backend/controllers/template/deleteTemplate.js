import Template from "../../models/template.js"
import MetaData from "../../models/metadata.js";

const deleteTemplate = async (req, res) => {

    try {
        const { id } = req.params;

        const template = await Template.findByPk(id);

        if (!template) {
            return res.status(404).json({
                message: "Template not found"
            });
        }

        // Delete all related template data
        await MetaData.destroy({
            where: {
                templateId: id
            }
        });

        // Delete the template
        await template.destroy();

        res.json({
            message: "Template and related data deleted successfully"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}

export default deleteTemplate