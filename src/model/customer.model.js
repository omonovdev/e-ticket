import { Schema, model } from 'mongoose';

const CustomerSchema = new Schema({
    fullname: { type: String, required: true },
    phone_number: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true }

});;

const Customer = model('Customer', CustomerSchema);
export default Customer;