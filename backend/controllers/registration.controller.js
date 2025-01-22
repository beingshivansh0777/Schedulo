const RegistrationModel = require('../models/registration.model');
const EventModel = require('../models/event.model');

module.exports.approveRegistration = async (req, res) => {
    try {
        const userId = req.user.id;
        const registration = await RegistrationModel.findById(req.params.registrationId);
        if (!registration) {
            return res.status(404).json({ message: "Registration not found" });
        }

        const event = await EventModel.findOne({
            _id: registration.eventId,
            createdBy: userId
        });

        if (!event) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        registration.approved = true;
        await registration.save();
        res.status(200).json({
            message: "Registration approved",
            registration: registration
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}