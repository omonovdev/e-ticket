import config from '../config/index.js';
import { createTransport } from 'nodemailer';

export const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS
    }
});
