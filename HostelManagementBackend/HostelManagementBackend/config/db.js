import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler';

const connectDB = asyncHandler(async () => {
    try {
        const conn = await mongoose.connect(process.env.DB)

        console.log(`MongoDB Connected ${conn.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }    
})

export default connectDB