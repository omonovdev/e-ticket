import Joi from "joi";

export const signUpCustomerValidator = (data) => {
    const customer = Joi.object({
        fullname: Joi.string().required(),
        phone_number: Joi.string().regex(/^\+?998[-\s]?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/).required(),
        email: Joi.string().email().required()
    });
    return customer.validate(data);
};

export const signInCustomerValidator = (data) => {
    const customer = Joi.object({
        email: Joi.string().email().required()

    });
    return customer.validate(data);
}

export const confirmSignInCustomerValidator = (data) => {
    const customer = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required()
    });
    return customer.validate(data);
}
export const updateCustomerValidator = (data) => {
    const customer = Joi.object({
        fullname: Joi.string().optional(),
        phone_number: Joi.string().regex(/^\+?998[-\s]?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/).optional(),
        email: Joi.string().email().required()
    });

    return customer.validate(data);

}