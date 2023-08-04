
const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)
    
    res.json({
        message : err.message,
        stack : process.env.NODE_ENV === 'production' ? null : err.stack
    })
}
 export {errorHandler}

//Changes done from here
// const errorHandler = (err, req, res, next) => {
//     res.status(500).json({
//         message : err.message,
//         stack : process.env.NODE_ENV === 'production' ? null : err.stack
//     })
// }

// export {errorHandler}