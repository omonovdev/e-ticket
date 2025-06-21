import Joi from "joi";

export const createTransportValidator = (data) => {
    const transport = Joi.object({
        transportType: Joi.string()
            .lowercase()
            .valid("bus", "car", "plane", "ship", "trolleybus", "metro")
            .required(),
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[17])\s?\d{3}\s?\d{2}\s?\d{2}$/).required(),
        transportNumber: Joi.string().regex(/^(?:[1-9][0-9]{0,2}|1000)$/).required(),
        class: Joi.string().required(),
        seat: Joi.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/).required()
    });
    return transport.validate(data);
};

export const signInTransportValidator = (data) => {
    const doctor = Joi.object({
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).required()
    });
    return doctor.validate(data);
}

export const confirmsignInTransportValidator = (data) => {
    const doctor = Joi.object({
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).required(),
        otp: Joi.string().length(6).required()
    });
    return doctor.validate(data);
}

export const updateTransportValidator = (data) => {
    const transport = Joi.object({
        transportType: Joi.string()
            .lowercase()
            .valid("bus", "car", "plane", "ship", "trolleybus", "metro")
            .optional(),
        phoneNumber: Joi.string().regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/).required(),
        transportNumber: Joi.string().regex(/^(?:[1-9][0-9]{0,2}|1000)$/).optional(),
        class: Joi.string().optional(),
        seat: Joi.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/).optional()
    });
    return transport.validate(data);
}
