import { Schema, model } from "mongoose";

const transportSchema = new Schema({
    transportType: { type: String, required: true },
    transportNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    class: { type: String, required: true },
    seat: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

transportSchema.virtual('tickets', {
    ref: "Ticket",
    localField: '_id',
    foreignField: 'transportID'
});

const Transport = model('Transport', transportSchema);
export default Transport;
