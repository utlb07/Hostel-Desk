import express from 'express'
const studentRouter = express.Router()

import {authUser, authAdmin} from '../middleware/authMiddleware.js'
import {getAllStudent, postStudent, deleteStudent, updateStudent, getStudent, changePassword} from '../controllers/studentController.js'

studentRouter.route("/")
    .get(authUser, getAllStudent)
    .post(postStudent)

studentRouter.route("/:studentId")
    .get(authUser, getStudent)
    .delete(authUser, authAdmin, deleteStudent)
    .put(authUser, authAdmin, updateStudent)   
    
studentRouter.post("/password", authUser, changePassword)


export default studentRouter;