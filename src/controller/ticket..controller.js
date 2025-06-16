import { isValidObjectId } from "mongoose";
import { resSuccses } from "../helpers/resSuccess.js";
import { ErrorRes } from "../helpers/error-handle.js";
import Ticket from '../model/ticket.model.js';
import Transport from '../model/transport.model.js'; 
import {
    createTicketValidator,
    updateTicketValidator
} from '../validation/ticket.validation.js';

export class TicketController {
    async createTicket(req, res) {
        try {
            const { value, error } = createTicketValidator(req.body);
            if (error) return ErrorRes(res, error.message, 422);

            
            if (!isValidObjectId(value.transportID)) {
                return ErrorRes(res, "Invalid transportID format", 400);
            }
            const transport = await Transport.findById(value.transportID);
            if (!transport) {
                return ErrorRes(res, "Transport not found", 404);
            }
            const ticket = await Ticket.create(value);
            return resSuccses(res, ticket, 201);
        } catch (error) {
            return ErrorRes(res, error);
        }
    }

    async getAllTickets(_, res) {
        try {
            const tickets = await Ticket.find().populate('transportID');
            return resSuccses(res, tickets);
        } catch (error) {
            return ErrorRes(res, error);

        }

    }
    async getTicketById(req, res) {
        try {
            const id = req.params.id;
            const ticket = await TicketController.findTicketById(res, id);

            return resSuccses(res, ticket);
        } catch (error) {
            return ErrorRes(res, error);
        }
    };
async updateTicketById(req, res) {
    try {
        const id = req.params.id;
        await TicketController.findTicketById(res, id);

        const { value, error } = updateTicketValidator(req.body);
        if (error) {
            return ErrorRes(res, error, 422);
        }

        if (value.transportID) {
            const transport = await Transport.findById(value.transportID);
            if (!transport) {
                return ErrorRes(res, 'Transport not found', 404);
            }
        }

        const updateTicket = await Ticket.findByIdAndUpdate(id, value, { new: true })
            .populate('transportID'); 

        return resSuccses(res, updateTicket);
    } catch (error) {
        return ErrorRes(res, error);
    }
}

    async deleteTicketById(req, res){
        try {
            const id = req.params.id;
            await Ticket.findByIdAndDelete(id);
            return resSuccses(res, 'Ticket deleted Successfully');
        } catch (error) {
            return ErrorRes(res, error);
        }
    }

    static async findTicketById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return ErrorRes(res, 'Invalid ObjectId', 400);
            }
            const ticket = await Ticket.findById(id).populate('transportID');
            if (!ticket) {
                return ErrorRes(res, 'Ticket not Found', 404);
            }
            return ticket;

        } catch (error) {
            return ErrorRes(res, error);

        }
    }


}
