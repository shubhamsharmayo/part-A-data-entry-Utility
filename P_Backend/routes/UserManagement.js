import express from 'express'


const router = express.Router()

import login from '../controllers/auth/login.js'
import signup from '../controllers/auth/singup.js'
import getUsers from '../controllers/userManagement/getAllUsers.js'

router.post('/login',login);
router.post('/signup',signup)
router.get('/getallusers',getUsers )


export default router