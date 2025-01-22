const RegistrationModel = require('../models/registration.model');
const EventModel = require('../models/event.model');
const redis = require('../db/redis');

module.exports.approveRegistration = async (req, res) => {
    try {
        let userId = req.user.id;
        if (!userId) {
            const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded._id;
        }
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

        const cachedRegistration = await redis.get(`registrationCount:${event.slug}`);
        await redis.set(`registrationCount:${event.slug}`, parseInt(cachedRegistration) + 1, 'EX', 60 * 30); // Set the registration in redis cache

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