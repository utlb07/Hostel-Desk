import express from 'express'
const seatRouter = express.Router()

import {authUser, authAdmin} from '../middleware/authMiddleware.js'
import {getAllSeat, postSeat, deleteSeat, getSeat, updateSeat} from '../controllers/allocationController.js'

seatRouter.route("/")
    .get(authUser, authAdmin, getAllSeat)
    .post(authUser, authAdmin, postSeat)

seatRouter.route("/:seatId")
    .get(authUser,  getSeat)
    .delete(authUser, authAdmin, deleteSeat)
    .put(authUser, authAdmin, updateSeat)   

export default seatRouter;