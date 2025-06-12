import Joi from 'joi';

const passwordPattern  = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!#%*?&.,/-])[A-Za-z\d$@!#%*?&.,/-]{5,20}/;


export const createvalidator = (data) => {
     const admin  = Joi.object({
        username: Joi.string().min(4).required(),
        password:Joi.string().pattern(passwordPattern).required()

     });
     return admin.validate(data);
}

export const updateValidator = (data) =>{
    const admin  = Joi.object({
        username: Joi.string().min(4).optional(),
        password:Joi.string().pattern(passwordPattern).optional()

     });
     return admin.validate(data);
    
}