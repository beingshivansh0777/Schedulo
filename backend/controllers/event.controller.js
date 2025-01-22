const { validationResult } = require('express-validator');
const eventService = require('../services/event.service');
const EventModel = require('../models/event.model');
const RegistrationModel = require('../models/registration.model');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.createEvent = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        // console.log({ error: error.array() })
        return res.status(400).json({ error: error.array() });
    }
    const { title, description, mode, link = '', eventDate, registrationLimit, timeSlots } = req.body;

    const createdBy = req.user.id;

    const eventDetails = { title, description, mode, link, eventDate, registrationLimit, timeSlots, createdBy }

    try {
        const newEvent = await eventService.createEvent(eventDetails);
        return res.status(200).json({ event: newEvent })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }

}


module.exports.getEventById = async (req, res, next) => {
    const { eventId } = req.params;
    try {
        const event = await EventModel.findOne({
            _id: eventId,
            createdBy: req.user.id
        });


        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ event });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}

module.exports.getAllEvents = async (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const events = await EventModel.find({ createdBy: req.user.id });
        res.status(200).json({ events });
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}


module.exports.getSlug = async (req, res, next) => {
    const { slug } = req.params;

    try {
        const event = await EventModel.findOne({ slug });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ event });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.createRegistration = async (req, res, next) => {
    const { slug } = req.params;
    const { name, email, selectedTimeSlot } = req.body;

    try {
        const event = await EventModel.findOne({ slug });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if the time slot exists in the event
        const isValidTimeSlot = event.timeSlots.some(
            slot => slot.from === selectedTimeSlot.from && slot.to === selectedTimeSlot.to
        );

        if (!isValidTimeSlot) {
            return res.status(400).json({ message: "Invalid time slot selected" });
        }

        const register = await eventService.createRegistration({
            eventId: event._id,
            name,
            email,
            selectedTimeSlot
        })



        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.getRegistrations = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const event = await EventModel.findOne({
            _id: req.params.eventId,
            createdBy: userId
        });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const registrations = await RegistrationModel.find({ eventId: req.params.eventId })
            .sort({ registeredAt: -1 });

        res.status(200).json({ registrations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.getRegistrationCount = async (req, res, next) => {
    const { slug } = req.params;

    try {
        const event = await EventModel.findOne({ slug });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const registrationCount = await RegistrationModel.countDocuments({ eventId: event._id, approved: true });
        res.status(200).json({ count: registrationCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.getRegistrationLimit = async (req, res, next) => {
    const { slug } = req.params;

    try {
        const event = await EventModel.findOne({ slug });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ registrationLimit: event.registrationLimit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}