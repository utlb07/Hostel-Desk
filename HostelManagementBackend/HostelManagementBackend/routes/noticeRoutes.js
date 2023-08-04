import express from 'express'
const noticeRouter = express.Router()

import {authUser, authAdmin} from '../middleware/authMiddleware.js'
import {getAllNotice, postNotice, deleteNotice} from '../controllers/noticeController.js'

noticeRouter.route("/")
    .get(authUser, getAllNotice)
    .post(authUser, authAdmin, postNotice)

noticeRouter.delete("/:noticeId", authUser, authAdmin, deleteNotice)   

export default noticeRouter;