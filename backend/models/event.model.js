const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["offline", "online"],
        required: true
    },
    link: {
        type: String
    },
    eventDate: {
        type: Date,
        required: true
    },
    registrationLimit: {
        type: Number,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    timeSlots: [{
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    backgroundImage: {
        type: String,
    },
});


const EventModel = mongoose.model("Event", eventSchema);

module.exports = EventModel;
