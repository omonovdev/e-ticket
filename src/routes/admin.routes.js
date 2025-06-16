import { Router } from "express";
import { adminController


} from "../controller/admin.controller.js";

const controller = new adminController();

const router = Router();

router
    .post('/', controller.createadmin)
    .get('/', controller.getAlladmins)
    .get('/:id',controller.getByIDAdmin)
    .patch('/:id', controller.UpdateById)
    .delete('/:id', controller.deleteById)



    export default router;