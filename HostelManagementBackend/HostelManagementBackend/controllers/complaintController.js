import asyncHandler from 'express-async-handler'
import Complaint from '../model/complaintModel.js'
import User from '../model/userModel.js'
import Student from '../model/studentModel.js'
import Employee from '../model/employeesModel.js'
import nodemailer from 'nodemailer'

async function mailEmployee(complaint){

    const transporter = nodemailer.createTransport({
        service : "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.USERNAME,
            pass: process.env.PASSWORD
        }
    });

    const sub = complaint.title + " Room no: " + complaint.room
    const emp = await Employee.findOne({eid : complaint.eid})
    const receiver = emp.email
    const desc = complaint.description

    let info = await transporter.sendMail({
        from: process.env.USERNAME, // sender address
        to: receiver, // list of receivers
        subject: sub, // Subject line
        text: desc, // plain text body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
}


async function mailStudent(complaint){

    const transporter = nodemailer.createTransport({
        service : "gmail",
        host: "smtp.gmail.com",
        port: 587,//465,
        secure: true,
        auth: {
            user: process.env.USERNAME,
            pass: process.env.PASSWORD
        }
    });

    const sub = 'Complaint Resolved'
    const student = await Student.findOne({sid : complaint.sid})
    const receiver = student.email
    const desc = complaint.title + " Resolved By Employee with Id: " + complaint.eid + " On Date " + complaint.resolvedDate.toString().split('G')[0]

    let info = await transporter.sendMail({
        from: process.env.USERNAME, // sender address
        to: receiver, // list of receivers
        subject: sub, // Subject line
        text: desc, // plain text body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
}



// @desc    Add a Complaint
// @route   POST /complaints/
// @access  Private
const postComplaint = asyncHandler(async (req, res) => {
    const {title, description, eid} = req.body
    // console.log("Data taken")
    const emp = await Employee.findOne({eid})
    if(emp){
        // console.log("emp find")
        const user = await User.findById(req.user.id)
        const student = await Student.findOne({sid : user.username})

        if(student.room == 0){
            res.status(400).json("Invalid Request")
            throw new Error("Invalid Request")
        }

        var currentTime = new Date();
        var currentOffset = currentTime.getTimezoneOffset();
        var ISTOffset = 330;   // IST offset UTC +5:30 
        var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

        const comp = await Complaint.create({
            title,
            description,
            eid,
            date : ISTTime,
            name : student.studentName,
            sid : student.sid,
            room : student.room
        })

        if(comp){
            mailEmployee(comp).catch(console.error);
            res.status(200).json(comp)
        }else{
            res.status(500).json('Internal Server Error')
            throw new Error("Internal Server Error")
        }
    }else{
        console.log("emp not find")
        res.status(400).json('Invalid Employee Id')
        throw new Error("invalid Employee Id")
    }
})

// @desc    Get Complaint details
// @route   GET /complaints/
// @access  Private
const getAllComplaint = asyncHandler(async (req, res) => {
    
    const complaint = await Complaint.find({})

    if(complaint){
        res.status(200).json(complaint)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }

})


// @desc    Delete a Complaint
// @route   DELETE /complaints/:id
// @access  Private
const deleteComplaint = asyncHandler(async (req, res) => {
    const c = await Complaint.findById(req.params.complaintId)
    if(c == null){
        res.status(400).json('Invalid complaintId')
        throw new Error("Invalid complaintId")
    }

    const complaint = await Complaint.findByIdAndDelete(req.params.complaintId)

    if(complaint){
        res.status(200).json(complaint)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }    

})

// @desc    Resolved a Complaint
// @route   PUT /complaints/:id
// @access  Private
const updateComplaint = asyncHandler(async (req, res) => {
    const c = await Complaint.findById(req.params.complaintId)

    if(c != null){

        var currentTime = new Date();
        var currentOffset = currentTime.getTimezoneOffset();
        var ISTOffset = 330;   // IST offset UTC +5:30 
        var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset)*60000);

        const data = {
            resolved : true,
            resolvedDate : ISTTime
        }

        let complaint = await Complaint.findByIdAndUpdate(req.params.complaintId, 
                                           {$set: data}, { new: true })
        
        if(complaint){
            mailStudent(complaint).catch(console.error)
            res.status(200).json(complaint)
        }else{
            res.status(500).json('Internal Server Error')
            throw new Error("Internal Server Error")
        }
    }else{
        res.status(400).json('Invalid complaintId')
        throw new Error("Invalid complaintId")
    }

})


export {postComplaint, getAllComplaint, deleteComplaint, updateComplaint}