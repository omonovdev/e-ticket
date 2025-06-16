export const resSuccses = (res, resData, code = 200) => {
    return res.status(code).json({
        stutusCode: code,
        message: 'Success',
        data: resData
    })
} 