
import Joi from "joi";

export const createTicketValidator = (data) => {
    const ticket = Joi.object({
        ticketType: Joi.string()
            .lowercase()
            .valid("bus", "car", "plane", "ship", "trolleybus", "metro")
            .required(),
        from: Joi.string().required(),
        to: Joi.string().required(),
        price: Joi.number().min(0).required(),
        departure: Joi.date().iso().required(),
        arrival: Joi.date().iso().required(),
        transportID: Joi.string().length(24).hex().required(),
        customerID: Joi.string().length(24).hex().required(),
        class: Joi.string().required(),
        seat: Joi.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/).required()
    });

    return ticket.validate(data);
};

export const updateTicketValidator = (data) => {
    const ticket = Joi.object({
        ticketType: Joi.string()
            .lowercase()
            .valid("bus", "car", "plane", "ship", "trolleybus", "metro")
            .optional(),
        from: Joi.string().optional(),
        to: Joi.string().optional(),
        price: Joi.number().min(0).optional(), 
        departure: Joi.date().iso().optional(),
        arrival: Joi.date().iso().optional(), 
        transportID: Joi.string().length(24).hex().optional(),
        customerID: Joi.string().length(24).hex().optional(),
        class: Joi.string().optional(),
        seat: Joi.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/).optional()
    });

    return ticket.validate(data);
};

