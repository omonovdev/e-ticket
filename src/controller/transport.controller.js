import { isValidObjectId } from "mongoose";
import { ErrorRes } from "../helpers/error-handle.js";
import { resSuccses } from "../helpers/resSuccess.js";
import Transport from "../model/transport.model.js";
import { createTransportValidator, updateTransportValidator } from "../validation/transport.validation.js";

export class TransportController {

    async createTransport(req, res) {
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            const existsTransportNumber = await Transport.findOne({ transportNumber: value.transportNumber });
            if (existsTransportNumber) {
                return ErrorRes(res, `Transport Number already exists`, 409);
            }
            const transport = await Transport.create(value);
            return resSuccses(res, transport, 201);

        } catch (error) {
            return ErrorRes(res, error)
        }
    };


    async getAllTransport(_, res) {
        try {
            const transports = await Transport.find();
            return resSuccses(res, transports);
        } catch (error) {
            return ErrorRes(res, error);
        }
    };

    async getByIdTransport(req, res) {
        try {       
            const id = req.params.id;
            const transport = await TransportController.findTransportById(res, id);
            return resSuccses(res, transport);
        } catch (error) {
            return ErrorRes(res, error)
        }
    };


    async getUpdateById(req, res) {
        try {
            const id = req.params.id;
            const { value, error } = updateTransportValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            await TransportController.findTransportById(res, id);
            const updateTransport = await Transport.findByIdAndUpdate(id, value, { new: true });
            return resSuccses(res, updateTransport);
        } catch (error) {
            return ErrorRes(res, error);

        }
    };


    async deleteTransport(req, res) {
        try {
            const id = req.params.id;
            await TransportController.findTransportById(res, id);
            await Transport.findByIdAndDelete(id);
            return resSuccses(res, 'Deleted transport');
        } catch (error) {
            return ErrorRes(res, error);

        }
    };


    static async findTransportById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return ErrorRes(res, 'Invalid object ID', 400);
            }
            const transport = await Transport.findById(id);
            if (!transport) {
                return ErrorRes(res, 'Transport not Found', 404);
            }
            return transport;
        } catch (error) {
            return ErrorRes(res, error);
        }
    };

}

