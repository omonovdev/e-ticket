import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import { createSuperadmin } from './db/create-supperadmin.js';
import adminRouter from './routes/admin.routes.js';
import transportRouter from './routes/transport.routes.js';
import tikcetRouter from './routes/ticket.routes.js';
import cookieParser from 'cookie-parser';
import customerRouter from './routes/customer.routes.js';

const app = express();
app.use(express.json());

await connectDB();
await createSuperadmin();

app.use(cookieParser());

app.use('/admins', adminRouter);
app.use('/transports', transportRouter);
app.use('/tickets', tikcetRouter);
app.use('/customer', customerRouter);

app.listen(config.PORT, () => console.log(`Server running on port`,+config.PORT));