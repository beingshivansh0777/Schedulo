const { validationResult } = require('express-validator');
const eventService = require('../services/event.service');
const EventModel = require('../models/event.model');
const RegistrationModel = require('../models/registration.model');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const redis = require('../db/redis');

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
        let userId = req.user.id;
        if (!req.user.id) {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded._id;
        }

        const cachedEvents = await redis.get(`events:${userId}`);
        if (cachedEvents) {
            // console.log('using redis cache in event controller')
            return res.status(200).json({ events: JSON.parse(cachedEvents) }); // This will help to get the data from the cache
        }

        const events = await EventModel.find({ createdBy: userId });
        await redis.set(`events:${userId}`, JSON.stringify(events), 'EX', 60 * 10); // Set the data for events for the first time
        return res.status(200).json({ events });

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

        const cachedCount = await redis.get(`registrationCount:${slug}`);
        if (cachedCount) {
            // console.log('using redis cache in event controller for registration count')
            return res.status(200).json({ count: cachedCount });
        }

        const event = await EventModel.findOne({ slug });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }


        const registrationCount = await RegistrationModel.countDocuments({ eventId: event._id, approved: true });
        await redis.set(`registrationCount:${slug}`, registrationCount, 'EX', 60 * 5); // Set the registration count in redis cache
        res.status(200).json({ count: registrationCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.getRegistrationLimit = async (req, res, next) => {
    const { slug } = req.params;

    try {
        const cachedLimit = await redis.get(`registrationLimit:${slug}`);

        if (cachedLimit) {
            // console.log('using redis cache in event controller for registration limit')
            return res.status(200).json({ registrationLimit: cachedLimit });
        }

        const event = await EventModel.findOne({ slug });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        let foundLimit = event.registrationLimit;

        await redis.set(`registrationLimit:${slug}`, foundLimit, 'EX', 60 * 30); // Set the registration limit in redis cache
        res.status(200).json({ registrationLimit: foundLimit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}