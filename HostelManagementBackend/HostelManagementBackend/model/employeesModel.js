import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String, 
        required: true 
    },
    gender: {
        type: String, 
        required: true 
    },
    designation: {
        type: String, 
        required: true 
    },
    joiningDate: {
        type: Date, 
        required: true 
    },
    address: {
        type: String, 
        required: true 
    },
    salary: {
        type: Number, 
        required: true 
    },
    mobileNo: {
        type: Number, 
        unique: true, 
        required: true 
    },
    eid: {
        type: String, 
        unique: true,
        required: true 
    },
    email: {
        type : String,
        required: true
    },
});

export default mongoose.model("Employee", employeeSchema);