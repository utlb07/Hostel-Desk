import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    studentName: {
        type: String, 
        required: true 
    },
    sid: {
        type: String, 
        unique: true, 
        required: true
    },
    mobileNo: {
        type: Number, 
        unique: true, 
        required: true 
    },
    password : {
        type : String,
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true, 
        required: true 
    },
    branch: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true,
    },
    address:{
        type: String,
        required: true,
    },
    fatherName: {
        type: String, 
        required: true 
    },
    motherName: {
        type: String, 
        required: true 
    },
    fatherMobile: {
        type: Number,  
        required: true 
    },
    room :{
        type : Number,
        default : 0
    },
    accountNo : {
        type : Number,
        required : true
    },
    ifscCode : {
        type : String,
        required : true
    },
    reference : {
        type : String,
        unique : true,
        required : true
    },
})

export default mongoose.model('Students', studentSchema);
