import { isValidObjectId } from "mongoose";
import { ErrorRes } from "../helpers/error-handle.js";
import { resSuccses } from "../helpers/resSuccess.js";
import Transport from "../model/transport.model.js";
import {
    createTransportValidator,
    signInTransportValidator,
    confirmsignInTransportValidator,
    updateTransportValidator
} from "../validation/transport.validation.js";
import { generateOTP } from '../helpers/generate-otp.js';
import Ticket from "../model/ticket.model.js";
import NodeCache from "node-cache";
import { Token } from '../utils/token-service.js'
import { sendSMS } from '../helpers/send-sms.js'

const cache = new NodeCache();
const token = new Token();

export class TransportController {

    async createTransport(req, res) {
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            const existsPhoneNumber = await Transport.findOne({ phoneNumber: value.phoneNumber });
            if (existsPhoneNumber) {
                return ErrorRes(res, `Transport phoneNumber already exists`, 409);
            }
            const transport = await Transport.create(value);
            return resSuccses(res, transport, 201);

        } catch (error) {
            return ErrorRes(res, error)
        }
    };

    async signInTransport(req, res) {
        try {
            const { value, error } = signInTransportValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            const { phoneNumber } = value;
            const transport = await Transport.findOne({ phoneNumber });
            if (!transport) {
                return ErrorRes(res, 'Transport not found', 404);
            }
            const otp = generateOTP();
            cache.set(phoneNumber, otp, 120);
            const sms = "Sizning tasdiqlash parolingiz: " + otp;
            await sendSMS(phoneNumber.split('+')[1], sms);
            return resSuccses(res, {});

        } catch (error) {
            return ErrorRes(res, error)

        }
    };

    async confirmsignInTransport(req, res) {
        try {
            const { value, error } = confirmsignInTransportValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            const transport = await Transport.findOne({ phoneNumber: value.phoneNumber });
            if (!transport) {
                return ErrorRes(res, 'Transport not found ', 404);
            }
            const cacheOTP = cache.get(value.phoneNumber);
            if (!cacheOTP || cacheOTP != value.otp) {
                return handleError(res, 'OTP expired', 400);
            }
            cache.del(value.phoneNumber);
            const payload = { id: transport._id };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokeTransport', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return resSuccses(res, {
                data: transport,
                token: accessToken
            }, 200);
        } catch (error) {
            return ErrorRes(res, error)

        }
    }


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

