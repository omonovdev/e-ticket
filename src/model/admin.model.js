import { model, Schema } from "mongoose";

const AdminSchema = new Schema({
    username: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' }
});

const Admin = model('Admin', AdminSchema);
export default Admin;
