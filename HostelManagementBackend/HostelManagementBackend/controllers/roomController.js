import asyncHandler from 'express-async-handler'
import Room from '../model/roomModel.js'

// @desc    Add a Room
// @route   POST /rooms/addroom
// @access  Private
const postRoom = asyncHandler(async (req, res) => {

    const {start, end} = req.body

    for (let i = start; i <=end; i++){
        let r = await Room.create({room : i})
        if(r==null){
            res.status(500).json('Internal Server Error at room' + i)
        }
    }

    res.status(200).json("Room added")
})

// @desc    Get Room details
// @route   GET /rooms/
// @access  Private
const getAllRoom = asyncHandler(async (req, res) => {
    
    const room = await Room.find({})

    if(room){
        res.status(200).json(room)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }

})

export {postRoom, getAllRoom}