import { ErrorRes } from "../helpers/error-handle.js";
import { resSuccses } from "../helpers/resSuccess.js";
import config from "../config/index.js";
import Customer from '../model/customer.model.js'
import {
    createCustomerValidator,
    updateCustomerValidator
} from "../validation/customer.validation.js";

import { Token } from '../utils/token-service.js';

const token = new Token();

export class CustomerController {
    async signUp(req, res) {
        try {
            const { value, error } = createCustomerValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            const existsPhone = await Customer.findOne({ phone_number: value.phone_number });
            if (existsPhone) return ErrorRes(res, 'Phone number already registred', 409);

            const customer = await Customer.create(value);
            const payload = { id: customer._id };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenCutomer', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return resSuccses(res, {
                data: customer,
                token: accessToken
            }, 201);
        } catch (error) {
            return ErrorRes(res, error);

        }
    }
}