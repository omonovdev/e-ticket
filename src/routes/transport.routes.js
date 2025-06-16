import { Router } from "express";
import { TransportController } from "../controller/transport.controller.js";
const transport = new TransportController();
const router = Router();

router
    .post('/', transport.createTransport)
    .get('/',  transport.getAllTransport)
    .get('/:id', transport.getByIdTransport)
    .patch('/:id', transport.getUpdateById)
    .delete('/:id', transport.deleteTransport)


export default router;