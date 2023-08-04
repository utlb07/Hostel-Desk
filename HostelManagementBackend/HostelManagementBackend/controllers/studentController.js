
import asyncHandler from 'express-async-handler'
import Students from '../model/studentModel.js'
import User from '../model/userModel.js'
import Room from '../model/roomModel.js'
import bcrypt from 'bcryptjs'

// @desc    Register a Student
// @route   POST /students/
// @access  Public
const postStudent = asyncHandler(async(req, res) => {

    const reg = req.body.sid
    const studentExist = await Students.findOne({sid : reg})
    console.log(req.body);
    if(studentExist){
        res.status(400).json('Student with same detail exist')
        throw new Error('Student with same detail exist')
    }

    const student = await Students.create(req.body)
    if(student){

         // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(student.password, salt)

        const user = await User.create({
            username : reg,
            password : hashedPassword,
            admin : false
        })

        if(user == null){
            res.status(500).json("Internal Server Error")
            throw new Error("Invalid data please retry")
        }
        const s = await Students.findOne({sid :student.sid}).select(-password)
        res.status(200).json(s)
    }else{
        res.status(400).json("Invalid data")
        throw new Error("Invalid data please retry")
    }
})

// @desc    Get Student details
// @route   GET /students/
// @access  Private
const getAllStudent = asyncHandler(async(req, res) => {

    const student = await Students.find({})
    if(student){
        res.status(200).json(student)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }

})

// @desc    get a Student
// @route   GET /students/:studentId
// @access  Private
const getStudent = asyncHandler(async (req, res) => {

    const student = await Students.findById(req.params.studentId)

    if(student != null){
        res.status(200).json(student)
    }else{
        res.status(400).json("Invalid request")
        throw new Error("Student Not Found")
    }
})

// @desc    Update a Student
// @route   PUT /students/:studentId
// @access  Private
const updateStudent = asyncHandler(async (req, res) => {

    const s = await Students.findById(req.params.studentId)

    if(s.sid != req.body.sid){
        res.status(400).json('Cannot Change Registration Number')
        throw new Error("Cannot Change Registration Number")
    }

    if(s != null){
        let student = await Students.findByIdAndUpdate(req.params.studentId, 
                                {$set : req.body},{ new: true })
        
        if(student){
            res.status(200).json(req.body)
        }else{
            res.status(500).json('Internal Server Error')
            throw new Error("Internal Server Error")
        }
    }else{
        res.status(400).json('Invalid Id')
        throw new Error("Invalid studentId")
    }

})

// @desc    Delete a Student
// @route   DELETE /students/:studentId
// @access  Private
const deleteStudent = asyncHandler(async (req, res) => {

    const s = await Students.findById(req.params.studentId)
    
    if(s == null){
        res.status(400).json('Invalid Id')
        throw new Error("Invalid studentId")
    }

    const sid  = s.sid
    const ro = s.room
    const student = await Students.findByIdAndDelete(req.params.studentId)

    if(student){
        await User.findOneAndDelete({username : sid})
        const r = await Room.findOne({room : ro})
        if(r != null){
            await Room.findByIdAndUpdate(r._id, {countStudent : (r.countStudent-1)}, {new : true})
        }
        res.status(200).json(student)
    }else{
        res.status(400).json('Invalid Id')
        throw new Error("Invalid studentId")
    }

})

// @desc    change password
// @route   PUT /students/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {

    const u = await User.findById(req.user.id)
    const {oldPass, newPass} = req.body

    if(u  && (await bcrypt.compare(oldPass, u.password))){
        
        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPass, salt)
        let user = await User.findByIdAndUpdate(req.user.id, 
                                {password : hashedPassword},{ new: true })
        
        let student = await Students.findOneAndUpdate({sid : u.username},{password : newPass},{ new: true })                      
        
        if(user){
            res.status(200).json(user)
        }else{
            res.status(500).json('Internal Server Error')
            throw new Error("Internal Server Error")
        }
    }else{
        res.status(400).json('Invalid Request')
        throw new Error("Invalid userId")
    }

})


export {postStudent, getAllStudent, getStudent, updateStudent, deleteStudent, changePassword}