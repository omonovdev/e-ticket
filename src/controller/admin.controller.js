import Admin from "../model/admin.model.js";
import { resSuccses } from "../helpers/resSuccess.js";
import { ErrorRes } from "../helpers/error-handle.js";
import { Crypto } from '../utils/encrypte-decrypt.js';
import { isValidObjectId } from "mongoose";
import { createvalidator, updateValidator } from "../validation/admin.validation.js";

const crypto = new Crypto();

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
            return resSuccses(res, { message :'Admin not found'}, 404);

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







