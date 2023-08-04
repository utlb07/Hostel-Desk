import asyncHandler from 'express-async-handler'
import Employee from '../model/employeesModel.js'

// @desc    Add a Employee
// @route   POST /employees/
// @access  Private
const postEmployee = asyncHandler(async (req, res) => {

    const employeeExist = await Employee.findOne({eid : req.body.eid})

    if(employeeExist){
        res.status(400).json('Employee with same detail exist')
        throw new Error('Employee with same detail exist')
    }

    const employee = await Employee.create(req.body)

    if(employee){
        res.status(200).json(employee)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }

})

// @desc    Get Employee details
// @route   GET /employees/
// @access  Private
const getAllEmployee = asyncHandler(async (req, res) => {
    
    const employee = await Employee.find({})

    if(employee){
        res.status(200).json(employee)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }

})

// @desc    get a Employee
// @route   GET /employees/:employeeId
// @access  Private
const getEmployee = asyncHandler(async (req, res) => {

    const employee = await Employee.findById(req.params.employeeId)

    if(employee != null){
        res.status(200).json(employee)
    }else{
        res.status(404).json('Employee Not Found')
        throw new Error("Employee Not Found")
    }
})

// @desc    Update a Employee
// @route   PUT /employees/:id
// @access  Private
const updateEmployee = asyncHandler(async (req, res) => {
    const emp = await Employee.findById(req.params.employeeId)

    if(emp != null){
        let employee = await Employee.findByIdAndUpdate(req.params.employeeId, 
                                {$set: req.body},{ new: true })
        
        if(employee){
            res.status(200).json(employee)
        }else{
            res.status(500).json('Internal Server Error')
            throw new Error("Internal Server Error")
        }
    }else{
        res.status(400).json('Invalid employeeId')
        throw new Error("Invalid employeeId")
    }

})

// @desc    Delete a Employee
// @route   DELETE /employees/:id
// @access  Private
const deleteEmployee = asyncHandler(async (req, res) => {
    const e=await Employee.findById(req.params.employeeId)

    if(e == null){
        res.status(400).json('Invalid employeeId')
        throw new Error("Invalid employeeId")
    }

    let employee = await Employee.findByIdAndDelete(req.params.employeeId)

    if(employee){
        res.status(200).json(employee)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }    

})


export {postEmployee, getAllEmployee, getEmployee, updateEmployee, deleteEmployee}