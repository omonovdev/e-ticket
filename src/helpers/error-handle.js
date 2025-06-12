export const ErrorRes = (res, error, code = 500) => {
    const ErrorMessage = error.message ? error.message : error;
    return res.status(code).json({
        statusCode: code,
        message: ErrorMessage,

    })

}