import express from 'express'
const complaintRouter = express.Router()

import {authUser, authAdmin} from '../middleware/authMiddleware.js'
import {getAllComplaint, postComplaint, deleteComplaint, updateComplaint} from '../controllers/complaintController.js'

complaintRouter.route("/")
    .get(authUser, getAllComplaint)
    .post(authUser, postComplaint)

complaintRouter.route("/:complaintId")
    .delete(authUser, authAdmin, deleteComplaint)
    .put(authUser, authAdmin, updateComplaint)  

export default complaintRouter;