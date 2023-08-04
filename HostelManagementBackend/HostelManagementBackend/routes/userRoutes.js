import express from 'express'
const userRouter = express.Router()

import {authAdmin, authUser} from '../middleware/authMiddleware.js'
import {loginUser, addAdmin, getUser, changePassword} from '../controllers/userController.js'


userRouter.post("/login", loginUser) 
userRouter.post("/addAdmin", addAdmin)
userRouter.get("/isloggedin", authUser, getUser)
userRouter.post("/password", authUser, authAdmin, changePassword)

export default userRouter;