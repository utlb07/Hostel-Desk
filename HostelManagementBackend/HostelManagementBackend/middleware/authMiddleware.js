import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../model/userModel.js'


const authUser = asyncHandler(async (req, res, next) =>{
    let token
    
    if(req.headers.authorization.startsWith('Bearer')){
        try {
            // get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // get user from token
            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error ('Not authorized')
        }
    }else{
        res.status(401)
        throw new Error ('Not authorized, no token')
    }

})

const authAdmin = (req, res, next) =>{
   
    if(req.user.admin){
        next();
    }else{
        res.status(401)
        throw new Error ('You are Not authorized to perform this operation')
    }

}


export {authUser, authAdmin}