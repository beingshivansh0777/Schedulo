var mongoose = require('mongoose');

var registrationSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    selectedTimeSlot: {
        from: {
            type: String,
            required: true
        },
        to: {
            type: String,
            required: true
        }
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    approved: {
        type: Boolean,
        default: false
    }
});

registrationSchema.index({ eventId: 1 });

const RegistrationModel = mongoose.model("Registration", registrationSchema);
module.exports = RegistrationModel;