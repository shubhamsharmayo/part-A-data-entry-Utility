import express from 'express'

const router = express.Router()
import assignedTask from '../../controllers/Tasks/AssignTask.js'
import submitTask from '../../controllers/Tasks/taskupdation.js'
import mainComparison from '../../controllers/Tasks/mainComparison.js'
import getAllTasks from '../../controllers/Tasks/getAllTasks.js'
import updateCurrentIndex from '../../controllers/Tasks/updateCurrentIndex.js'
import getMetaData from '../../controllers/Tasks/getMetaData.js'
import updateMainCsvData from '../../controllers/Tasks/updateMainCsv.js'


router.get('/assignedtasks',assignedTask )
router.get('/submit/:taskId',submitTask )
router.get('/comparedata/:id',mainComparison)
router.get('/get/task/:id',getAllTasks)
router.post('/update/currentindex',updateCurrentIndex)
router.get('/get/metadata',getMetaData)
router.post('/update/csvdata',updateMainCsvData)

export default router