import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import { createSuperadmin } from './db/create-supperadmin.js';
import adminRouter from './routes/admin.routes.js';
import transportRouter from './routes/transport.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import cookieParser from 'cookie-parser';
import customerRouter from './routes/customer.routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

await connectDB();
await createSuperadmin();

app.use('/admins', adminRouter);
app.use('/transports', transportRouter);
app.use('/tickets', ticketRouter);
app.use('/customer', customerRouter);

app.use((err, req, res, next) => {
    if (err) {
        const statusCode = err.status ? err.status : 500;
        const message = err.message ? err.message : 'Internal server error';
        return res.status(statusCode).json({
            statusCode,
            message
        });
    }
})

app.listen(config.PORT, () => console.log(`Server running on port `, +config.PORT));  