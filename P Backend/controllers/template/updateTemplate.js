import Template from "../../models/template.js";
import MetaData from "../../models/metadata.js";
import fs from 'fs/promises';
import path from 'path';

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(JSON.parse(req.body.template))
    const template = await Template.findByPk(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Parse template JSON from body
    let templateData = {};
    if (req.body.template) {
      templateData = JSON.parse(req.body.template);
    }

    // Handle file upload
    let imagePath = template.imagePath; // keep existing by default
    if (req.file) {
      // Delete old image file if exists
      if (template.imagePath) {
        const oldImagePath = path.resolve(process.cwd(), 'uploads', template.imagePath);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.log('Failed to delete old image:', err);
        }
      }
      imagePath = req.file.filename;
    }

    // Update template fields using same field names as create endpoint
    const { templateName, typeOption, patternDefinition, blankDefination, boxes } = templateData;

    await template.update({
      name: templateName ?? template.name,
      typeOption: typeOption ?? template.typeOption,
      patternDefinition: templateData.pattern ?? templateData.pattern,
      blankDefination: (templateData.blank === '' ? 'space' : templateData.blank) ?? template.blank,
      imagePath: imagePath,
    });

    // Delete existing metadata for this template
    await MetaData.destroy({ where: { templateId: template.id } });

    // Create new metadata entries from boxes
    if (boxes && Array.isArray(boxes)) {
      await Promise.all(
        boxes.map(async (box) => {
          await MetaData.create({
            attribute: box.name,
            coordinateX: box.x.toString(),
            coordinateY: box.y.toString(),
            width: box.width.toString(),
            height: box.height.toString(),
            fieldType: box.category,
            dataFieldType: box.type,
            fieldLength: box.length.toString(),
            pageNo: 1, // default or from box.pageNo?
            fieldRange: '',
            pattern: false,
            blank: false,
            empty: false,
            templateId: template.id,
          });
        })
      );
    }

    // Fetch updated template with metadata to return
    const updatedTemplate = await Template.findByPk(template.id, {
      include: [
        {
          model: MetaData,
          attributes: { exclude: ['id', 'templeteId', 'createdAt', 'updatedAt'] },
        },
      ],
    });

    res.json({
      message: 'Template updated successfully',
      template: updatedTemplate,
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default updateTemplate;