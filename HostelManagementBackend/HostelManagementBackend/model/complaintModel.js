import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true 
    },
    description: {
        type: String, 
        required: true 
    },
    eid : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true,
    },
    resolved: {
        type: Boolean,
        default: false
    },
    name : {
        type : String,
        required : true
    },
    sid : {
        type : String,
        required : true
    },
    room : {
        type : Number,
        required : true
    },
    resolvedDate: {
        type : Date,
        default : Date.now()
    }
});


export default mongoose.model('Complaint', complaintSchema);