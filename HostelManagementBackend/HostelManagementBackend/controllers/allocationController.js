import asyncHandler from 'express-async-handler'
import Rooms from '../model/roomModel.js'
import Students from '../model/studentModel.js'

// @desc    Add a Seat
// @route   POST /seats/
// @access  Private
const postSeat = asyncHandler(async (req, res) => {
    //  console.log("Enter into")
    const {room} = req.body
    //  console.log(room)
    const r = await Rooms.findOne({room})
    const s = await Students.findOne({sid : req.body.sid}) 

    if(s==null || s.room != 0){
         console.log("1");
        res.status(400).json('Invalid Data Entry')
        throw new Error("Invalid data please retry")
    }

    if(r){ 
        let num =  r.countStudent;
        console.log(`Entered into r ${num}`);
        
        if(num >= 2){
            console.log("Checking");
            res.status(400).json('Number of student in a room cannot be greater than 2')
            throw new Error("Number of student in room is greater then equal to 2")
        }else{

            const student = await Students.findOneAndUpdate({sid : s.sid}, {room}, {new:true})
            
            if(student){
                const c = r.countStudent + 1
                console.log(`c is ${c} and default is ${r.countStudent}`)
                await Rooms.findOneAndUpdate({room}, {countStudent : c}, {new : true})
                res.status(200).json(student)
            }else{
                res.status(500).json('Internal Server Error')
                throw new Error("Internal Server Error")
            }
        }  
    }else{
        console.log("2");
        res.status(400).json('Invalid Data Entry')
        throw new Error("Invalid data please retry")
    }

})

// @desc    Get Seat details
// @route   GET /seats/
// @access  Private
const getAllSeat = asyncHandler(async (req, res) => {
    
    const seat = await Students.find({ room: { $ne: 0 } }).select("sid studentName room")

    if(seat){
        res.status(200).json(seat)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }
})


// @desc    Delete a Seat
// @route   DELETE /seats/:id
// @access  Private
const deleteSeat = asyncHandler(async (req, res) => {
    const s = await Students.findById(req.params.seatId)

    if(s == null){
        res.status(400).json("Invalid seatId")
        throw new Error("Invalid seatId")
    }

    const reg = s.sid
    const r = await Rooms.findOne({room : s.room})
    const student = await Students.findOneAndUpdate({sid : reg}, {room : 0}, {new:true}).select("sid studentName room")

    if(student){
        await Rooms.findByIdAndUpdate(r._id, {countStudent : (r.countStudent-1)}, {new : true})
        res.status(200).json(student)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }    

})

// @desc    get a Seat
// @route   GET /seats/:seatId
// @access  Private
const getSeat = asyncHandler(async (req, res) => {

    const seat = await Students.findById(req.params.seatId).select("sid studentName room")

    if(seat != null){
        res.status(200).json(seat)
    }else{
        res.status(400).json('Seat Not Found')
        throw new Error("Seat Not Found")
    }
})

// @desc    Update a Seat
// @route   PUT /seats/:id
// @access  Private
const updateSeat = asyncHandler(async (req, res) => {
    const s =  await Students.findById(req.params.seatId)
    const r1 = await Rooms.findOne({room : req.body.room})

    if((r1.countStudent < 2) && s != null){
        
        const r2 = await Rooms.findOne({room : s.room})
        let seat = await Students.findOneAndUpdate({sid : s.sid}, {room : req.body.room}, {new:true}).select("sid studentName room")
        if(seat){
            await Rooms.findByIdAndUpdate(r2._id, {countStudent : (r2.countStudent-1)}, {new : true})
            await Rooms.findByIdAndUpdate(r1._id, {countStudent : (r1.countStudent+1)}, {new : true})

            res.status(200).json(seat)
        }else{
            res.status(500).json('Internal Server Error')
            throw new Error("Internal Server Error")
        }
    }else{
        console.log("3");
        res.status(400).json("Invalid Data")
        throw new Error("Invalid seatId")
    }

})


export {postSeat, getAllSeat, deleteSeat, getSeat, updateSeat}