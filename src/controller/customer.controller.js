import { ErrorRes } from "../helpers/error-handle.js";
import { resSuccses } from "../helpers/resSuccess.js";
import config from "../config/index.js";
import Customer from '../model/customer.model.js'
import {
    signUpCustomerValidator,
    signInCustomerValidator,
    updateCustomerValidator,
    confirmSignInCustomerValidator
} from "../validation/customer.validation.js";
import { generateOTP } from "../helpers/generate-otp.js";
import { Token } from '../utils/token-service.js';
import NodeCache from "node-cache";
import { transporter } from "../helpers/send-mail.js";

const token = new Token();
const cache = new NodeCache();

export class CustomerController {
    async signUp(req, res) {
        try {
            const { value, error } = signUpCustomerValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            const existsPhone = await Customer.findOne({ phone_number: value.phone_number });
            if (existsPhone) return ErrorRes(res, 'Phone number already registred', 409);

            const existsEmail = await Customer.findOne({ email: value.email });
            if (existsEmail) return ErrorRes(res, 'Email address already registred', 409);

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
    };

   async signIn(req, res) {
    try {
        const { value, error } = signInCustomerValidator(req.body);
        if (error) {
            return ErrorRes(res, error, 422);
        }

        const email = value.email;
        const customer = await Customer.findOne({ email });

        if (!customer) {
            return ErrorRes(res, 'Customer not found', 404);
        }

        const otp = generateOTP();
        const mailOPtions = {
            from: config.MAIL_USER,
            to: email,
            subject: 'e-ticket',
            text: `Your OTP code is: ${otp}`
        };

        
        await transporter.sendMail(mailOPtions);

        cache.set(email, otp, 120);
        return resSuccses(res, {});
        
    } catch (error) {
        console.log(error);
        return ErrorRes(res, 'Error on sending email', 400);
    }
}

    

    async confirmSignIn(req, res){
        try {
            const { value, error } = confirmSignInCustomerValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422)
            }
            const customer = await Customer.findOne({ email: value.email });
            if (!customer){
                return ErrorRes(resSuccses, 'Customer not found', 404);
            } ;
            const cacheOTP = cache.get(value.email);
            if (!cacheOTP || cacheOTP != value.otp) {
                return ErrorRes(res, 'OTP expired', 400);
            }
            cache.del(value.email);
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
            }, 200);
        } catch (error) {
            return ErrorRes(res, error);

        }
    }



    async newAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenCutomer;
            if (!refreshToken) {
                return ErrorRes(res, 'Refresh token epxired', 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return ErrorRes(res, 'Invalid token', 400);
            }
            const customer = await Customer.findById(decodedToken.id);
            if (!customer) {
                return ErrorRes(res, 'Customer not found', 404);
            }
            const payload = { id: Customer._id };
            const accessToken = await token.generateAccessToken(payload);
            return resSuccses(res, {
                token: accessToken
            });
        } catch (error) {
            return ErrorRes(res, error);
        }
    }
    
    async logOut(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenCutomer;
            if (!refreshToken) {
                return ErrorRes(res, 'Refresh token epxired', 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return ErrorRes(res, 'Invalid token', 400);
            }
            const customer = await Customer.findById(decodedToken.id);
            if (!customer) {
                return ErrorRes(res, 'Customer not found', 404);
            }
            res.clearCookie('refreshTokenCustomer');
            return resSuccses(res, {});
        } catch (error) {
            return ErrorRes(res, error);
        }
 }
}