import Template from "../../models/template.js"
import MetaData from "../../models/metadata.js"

const templateDataUpload = async (req, res) => {

    console.log(req.file)
    const templateData = JSON.parse(req.body.template)
    console.log(templateData)
    const { boxes, templateName, pattern, blank, optionCount, optionType, optionValues } = templateData

    console.log(JSON.parse(req.body.template))

    let templateindex
    if (templateData) {
        templateindex = await Template.create({
            name: templateName,
            typeOption: optionValues,
            patternDefinition: pattern,
            blankDefination: blank == '' ? "space" : blank,
            imagePath: req.file.filename,
            pageCount:1
        })
    }
    console.log(templateindex.id)

    await Promise.all(
        boxes.map(async(current)=>{
           await MetaData.create({
                attribute:current.name,
                coordinateX:current.x,
                coordinateY:current.y,
                width:current.width,
                height:current.height,
                fieldType:current.category,
                dataFieldType:current.type,
                fieldLength:current.length,
                templateId:templateindex.id
            })
        })
    )

    res.json({
        message:'template created successfully'
    })

}

export default templateDataUpload