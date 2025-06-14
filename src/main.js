import express from 'express';
import { config } from 'dotenv';
import { connectDB } from './db/index.js';
import { createSuperadmin } from './db/create-supperadmin.js';
import adminRouter from './routes/admin.routes.js';
import transportRouter from './routes/transport.routes.js';
import tikcetRouter from './routes/ticket.routes.js';
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