import Joi from "joi";

export const createCustomerValidator = (data) => {
    const customer = Joi.object({
        fullname: Joi.string().required(),
        phone_number: Joi.string().regex(/^\+?998[-\s]?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/).required(),
        email: Joi.string().regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/).required()
    });
    return customer.validate(data);
}
export const updateCustomerValidator = (data) => {
    const customer = Joi.object({
        fullname: Joi.string().optional(),
        phone_number: Joi.string().regex(/^\+?998[-\s]?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/).optional(),
        email: Joi.string().regex(/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/).optional()
    });

    return customer.validate(data);

}