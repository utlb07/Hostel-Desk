import express from 'express'
const roomRouter = express.Router()

import {authUser, authAdmin} from '../middleware/authMiddleware.js'
import {getAllRoom, postRoom} from '../controllers/roomController.js'

roomRouter.route("/")
    .get(authUser, getAllRoom)
    
roomRouter.get('/addroom', postRoom)
  

export default roomRouter;