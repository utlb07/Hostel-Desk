import asyncHandler from 'express-async-handler'
import Notice from '../model/noticeModel.js'

// @desc    Add a Notice
// @route   POST /notices/
// @access  Private
const postNotice = asyncHandler(async (req, res) => {

    const notice = await Notice.create(req.body)

    if(notice){
        res.status(200).json(notice)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }

})

// @desc    Get Notice details
// @route   GET /notices/
// @access  Private
const getAllNotice = asyncHandler(async (req, res) => {
    
    const notice = await Notice.find({})

    if(notice){
        res.status(200).json(notice)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }

})


// @desc    Delete a Notice
// @route   DELETE /notices/:id
// @access  Private
const deleteNotice = asyncHandler(async (req, res) => {
    const noticeId = req.params.noticeId
    const notice = await Notice.findById(noticeId)

    if(notice == null){
        res.status(400).json('Invalid Request')
        throw new Error("Invalid request")
    }


    const n = await Notice.findByIdAndDelete(noticeId)
    if(n){
        res.status(200).json(n)
    }else{
        res.status(500).json('Internal Server Error')
        throw new Error("Internal Server Error")
    }    

})


export {postNotice, getAllNotice, deleteNotice}