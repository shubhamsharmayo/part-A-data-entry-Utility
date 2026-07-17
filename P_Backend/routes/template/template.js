import express from 'express'

const router = express.Router()

import templateDataUpload from '../../controllers/template/template.js'
import upload from '../../middleware/upload.js'
import getAllTemplate from '../../controllers/template/getAllTemplate.js'
import templateDataById from '../../controllers/template/templateDataById.js'
import updateTemplate from '../../controllers/template/updateTemplate.js'
import deleteTemplate from '../../controllers/template/deleteTemplate.js'
import csvAndImageUpload from '../../controllers/template/csvAndImageUpload.js'
import csvUploader from '../../middleware/csvUploaderConfig.js'
import getCsvHeaderController from '../../controllers/template/getCsvHeader.js'
import handleData from '../../controllers/template/dataMapping.js'
import getTotalCsvDataController from '../../controllers/template/getTotalCsvData.js'
import assignUser from '../../controllers/template/assignTask.js'
import downloadSeparateCsv from '../../controllers/template/downloadcsv.js'

// sj
import findDuplicatesController from '../../controllers/template/findDuplicates.js'
// sj


router.post('/template/createtemplate', upload.single("image"), templateDataUpload)
router.get('/template/alltemplate', getAllTemplate)
router.get('/template/:id', templateDataById)
router.put('/template/updatetemplate/:id', upload.single("image"), updateTemplate)
router.delete('/template/delete/:id', deleteTemplate)
router.post('/template/fileupload', csvUploader.fields([
    {
        name: "overallCsv",
        maxCount: 1,
    },
    {
        name: "absentCsv",
        maxCount: 1,
    },
    {
        name: "scannedCsv",
        maxCount: 1,
    },
    {
        name: "rarFile",
        maxCount: 1,
    },
]), csvAndImageUpload)
router.get('/template/getcsvheader/:id', getCsvHeaderController)
router.post('/template/mapdata', handleData)
router.get('/gettotaldata', getTotalCsvDataController)
router.post("/assign/user", assignUser);
router.get('/download/separatecsv/:id',downloadSeparateCsv)

// sj
router.get('/template/findduplicates/:id', findDuplicatesController)

export default router