import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../model/userModel.js'
import bcrypt from 'bcryptjs'
import { errorHandler } from '../middleware/errorMiddleware.js'

// @desc    Add a Admin
// @route   POST /users/addAdmin
// @access  Public
const addAdmin = asyncHandler(async (req, res) => {

    const {username, password} = req.body

    // check if user exist
    const userExist = await User.findOne({username})

    if(userExist){
        res.status(400).json('User Already Exist')
        throw new Error('User Already Exist')
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // add user
    const user = await User.create({
        username,
        password : hashedPassword,
        admin : true
    })

    if(user){
        res.status(200).json({
            id : user.id,
        })
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error ('Internal Server Error')
    }
})


// @desc    Autheticate a User
// @route   POST /users/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const {username, password} = req.body
    // console.log(username);
    // check for username
    const user = await User.findOne({username})
    console.log(user);
    if(user && (await bcrypt.compare(password, user.password))){
    //    console.log("fsadfa")
        res.status(200).json({
            success: true, 
            status: 'Login Successful!',
            admin: user.admin,
            // token:"aryan"
             token : generateToken(user._id)
        })

    }else{
        res.status(401).json({ 
            success: false, 
            status: 'Login Unsuccessful!', 
            err: 'Could not log in user!' 
        })
    }
})


// @desc    Get user Data
// @route   GET /users/isloggedin
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if(user){
        res.status(200).json(user)
    }else{
        res.status(400).json('Invalid Data')
        throw new Error("Invalid data")
    }
})


// @desc    change password
// @route   POST /users/password
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


// generate JWT token
const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : '24h',
    })
}

export {addAdmin, loginUser, getUser, changePassword}
