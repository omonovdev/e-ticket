
import { Schema, model, Types } from "mongoose";

const TicketSchema = new Schema({
    ticketType: {
        type: String,
        required: true,
        enum: ["bus", "car", "plane", "ship", "trolleybus", "metro"]
    },
    from: { type: String, required: true },
    to: { type: String, required: true },
    price: { type: Number, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    transportID: { type: Types.ObjectId, ref: "Transport", required: true },
    class: { type: String, required: true },
    seat: { type: String, required: true },

    customerID: {
        type: Types.ObjectId,
        ref: "Customer",
        required: true
    }
}, {
    timestamps: true
});

const Ticket = model("Ticket", TicketSchema);
export default Ticket;
