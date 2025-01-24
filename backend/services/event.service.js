const EventModel = require('../models/event.model');
const shortid = require('shortid');
const RegistrationModel = require('../models/registration.model');
const redis = require('../db/redis');

module.exports.createEvent = async ({ title, description, mode, link = '', eventDate, registrationLimit, timeSlots, createdBy, backgroundImage }) => {
    if (!title || !description || !mode || !eventDate || !registrationLimit || !timeSlots || !createdBy || !backgroundImage) {
        throw new Error('All fields are required');
    }
    try {
        const slug = shortid.generate();

        const newEvent = new EventModel({
            title,
            description,
            mode,
            link,
            eventDate: new Date(eventDate),
            registrationLimit,
            timeSlots,
            slug: slug,
            createdBy,
            backgroundImage
        });

        await newEvent.save();

        // Update Redis cache
        const redisKey = `events:${createdBy}`;
        const cachedEvents = await redis.get(redisKey);
        if (cachedEvents) {
            let events = cachedEvents ? JSON.parse(cachedEvents) : [];
            events.push(newEvent.toObject());
            await redis.set(redisKey, JSON.stringify(events), 'EX', 60 * 10); // This will keep the changes for 10 minutes, we will update the values when a new event is created directly from the service
        }
        return newEvent;
    } catch (error) {
        throw new Error(error);
    }

}

module.exports.createRegistration = async ({ eventId, name, email, selectedTimeSlot }) => {
    if (!eventId || !name || !email || !selectedTimeSlot) {
        throw new Error('All fields are required');
    }
    try {
        const registration = new RegistrationModel({
            eventId,
            name,
            email,
            selectedTimeSlot
        });
        await registration.save();
        return registration;
    } catch (error) {
        throw new Error(error);
    }

}