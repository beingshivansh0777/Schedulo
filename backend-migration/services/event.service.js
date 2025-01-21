const EventModel = require('../models/event.model');
const shortid = require('shortid');
const RegistrationModel = require('../models/registration.model');

module.exports.createEvent = async ({ title, description, mode, link = '', eventDate, registrationLimit, timeSlots, createdBy }) => {
    if (!title || !description || !mode || !eventDate || !registrationLimit || !timeSlots || !createdBy) {
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
        });

        await newEvent.save();
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