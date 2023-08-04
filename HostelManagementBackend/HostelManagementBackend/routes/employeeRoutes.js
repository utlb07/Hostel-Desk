import express from 'express'
const employeeRouter = express.Router()

import {authUser, authAdmin} from '../middleware/authMiddleware.js'
import {getAllEmployee, postEmployee, deleteEmployee, updateEmployee, getEmployee} from '../controllers/employeeController.js'

employeeRouter.route("/")
    .get(authUser, getAllEmployee)
    .post(authUser, authAdmin, postEmployee)

employeeRouter.route("/:employeeId")
    .get(authUser, authAdmin, getEmployee)
    .delete(authUser, authAdmin, deleteEmployee)
    .put(authUser, authAdmin, updateEmployee)    

export default employeeRouter;