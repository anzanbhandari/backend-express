const asyncHandler = (requestHandler) => {
    (req, res,  next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err))
    }
}

export {asyncHandler}

const request = (request) => {
    (req, res, next) => {
        Promise.resolve(request (req, res, next)).catch((err)=> next(err))
    }
}

export {request}

//Try catch approach
// const  asyncHandler = (fn) => async (req, res, next) =>{
//     try {
//         await (req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
