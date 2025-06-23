import Admin from "../model/admin.model.js";
import { resSuccses } from "../helpers/resSuccess.js";
import { ErrorRes } from "../helpers/error-handle.js";
import { Crypto } from '../utils/encrypte-decrypt.js';
import { isValidObjectId } from "mongoose";
import { createvalidator, updateValidator } from "../validation/admin.validation.js";
import { Token } from "../utils/token-service.js";
import { config } from "dotenv";
const crypto = new Crypto();
const token = new Token();

export class adminController {
    async createadmin(req, res) {
        try {
            const { value, error } = createvalidator(req.body)
            if (error) {
                return ErrorRes(res, error, 422)
            }
            const existsAdmin = await Admin.findOne({ username: value.username });
            if (existsAdmin) {
                return ErrorRes(res, `Username already exits`, 409);
            }
            const hashedPassword = await crypto.encrypt(value.password);
            const admin = await Admin.create({
                username: value.username,
                hashedPassword
            });
            return resSuccses(res, admin, 201)
        } catch (error) {
            return ErrorRes(res, error)
        }
    };


    async signInAdmin(req, res) {
        try {
            const { value, error } = createvalidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            const admin = await Admin.findOne({ username: value.username });
            if (!admin) {
                return ErrorRes(res, 'Admin not found', 404);
            }
            const payload = { id: admin._id, role: admin.role };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenAdmin', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000

            });
            return resSuccses(res, { data: admin, token: accessToken }, 200);

        } catch (error) {
            return ErrorRes(res, error);

        }
    };

    async newAccessToken(req, res) {
        try {
            const refreshToken = req.cookie?.refreshTokenAdmin;
            if (!refreshToken) {
                return ErrorRes(res, 'Refresh token expired', 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return ErrorRes(res, 'Invalid Token ', 400);
            }
            const admin = await Admin.findById(decodedToken.id);
            if (!admin) {
                return ErrorRes(res, 'Admin not found', 404);
            }
            const payload = { id: admin._id, role: admin.role };
            const accessToken = await token.generateAccessToken(payload);
            return resSuccses(res, {
                token:accessToken
            });

        } catch (error) {
            return ErrorRes(res, error)

        }
    };

    async logOut(req, res) {
        try {
            const refreshToken = req.cookie?.refreshToken;
            if(!refreshToken) {
                return ErrorRes(res,'Refresh token expired', 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if(!decodedToken){
                return ErrorRes(res, 'Invalid token', 400);
            }
            const admin = await Admin.findById(decodedToken.id);
            if(!admin){
                return ErrorRes(res, 'Admin not found ', 404);
            }
            res.clearCookie('refreshTokenAdmin');
            return resSuccses(res, {});
        } catch (error) {
            return ErrorRes(res, error);
            
        }
    }

    async getAlladmins(req, res) {
        try {
            const admin = await Admin.find();

            return resSuccses(res, admin);

        } catch (error) {
            return ErrorRes(res, error)

        }
    }

    async getByIDAdmin(req, res) {
        try {
            const admin = await adminController.FindByIdAdmin(res, req.params.id);
            return resSuccses(res, admin);
        } catch (error) {
            return ErrorRes(res, error);
        }
    }
    async UpdateById(req, res) {
        try {
            const id = req.params.id;
            const admin = await adminController.FindByIdAdmin(res, id);
            const { value, error } = updateValidator(req.body);
            if (error) {
                return ErrorRes(res, error, 422);
            }
            let hashedPassword = admin.hashedPassword;
            if (value.password) {
                hashedPassword = await crypto.encrypt(value.password);
            }
            const updateAmdin = await Admin.findByIdAndUpdate(id, {
                ...value,
                hashedPassword
            }, { new: true });
            return resSuccses(res, updateAmdin);
        } catch (error) {
            return ErrorRes(res, error);
        }
    }

    async deleteById(req, res) {
        try {
            const id = req.params.id;
            await adminController.FindByIdAdmin(res, id);
            await Admin.findByIdAndDelete(id);
            return resSuccses(res, { message: 'Admin not found' }, 404);

        } catch (error) {
            return ErrorRes(res, error)

        }
    }

    static async FindByIdAdmin(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return ErrorRes(res, `Invalid Object Id`, 400);
            }
            const admin = await Admin.findById(id);
            if (!admin) {
                return ErrorRes(res, 'Admin not found', 404);
            }
            return admin;
        } catch (error) {
            return ErrorRes(res, error)

        }
    }



}







