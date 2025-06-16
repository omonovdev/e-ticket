import express from 'express';
<<<<<<< HEAD
import config from './config/index.js';
=======
import { config } from 'dotenv';
>>>>>>> 2e502ffb688c0430f18739a512618e5eaa91dcc0
import { connectDB } from './db/index.js';
import { createSuperadmin } from './db/create-supperadmin.js';
import adminRouter from './routes/admin.routes.js';
import transportRouter from './routes/transport.routes.js';
import tikcetRouter from './routes/ticket.routes.js';
<<<<<<< HEAD
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
=======
config();
const app = express();
const PORT = Number(process.env.PORT);
await connectDB();
app.use(express.json());
await createSuperadmin();

app.use('/admins',adminRouter );
app.use('/transports', transportRouter);
app.use('/tickets', tikcetRouter);

app.listen(PORT, () => console.log(`Server running on port`, PORT));
>>>>>>> 2e502ffb688c0430f18739a512618e5eaa91dcc0
