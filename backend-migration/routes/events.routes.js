const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { body } = require('express-validator');

router.post('/', authMiddleware.authUser, [
    body('title').not().isEmpty().trim().escape()
        .withMessage('Title is required and must be valid'),
    body('description').not().isEmpty().trim().escape()
        .withMessage('Description is required and must be valid'),
    body('mode').not().isEmpty().trim().escape()
        .withMessage('Mode is required and must be valid'),
    body('eventDate').not().isEmpty().trim().escape().custom(value => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
        return true;
    }).withMessage('Event date is required and must be valid'),
    body('registrationLimit').not().isEmpty().trim().escape()
        .withMessage('Registration limit is required and must be valid'),
    body('timeSlots').isArray({ min: 1 }).withMessage('Time slots are required and must be an array').custom((timeSlots) => {
        timeSlots.forEach(slot => {
            if (!slot.from || !slot.to) {
                throw new Error('Each time slot must have a "from" and "to" field');
            }
        });
        return true;
    }).withMessage('Time slots are required and must be valid'),
], (req, res) => {
    eventController.createEvent(req, res);
});

router.get('/id/:eventId', authMiddleware.authUser, (req, res) => {
    eventController.getEventById(req, res);
});

router.get('/', authMiddleware.authUser, (req, res) => {
    eventController.getAllEvents(req, res);
});

router.get('/:slug', (req, res) => {
    eventController.getSlug(req, res);
});

router.post('/:slug/register', [
    body('name').not().isEmpty().trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('selectedTimeSlot').not().isEmpty().isObject().custom(value => {
        if (!value.from || !value.to) {
            throw new Error('Selected time slot must have a "from" and "to" field');
        }
        return true;
    })
], (req, res) => {
    eventController.createRegistration(req, res);
})

router.get('/:eventId/registrations', authMiddleware.authUser, (req, res) => {
    eventController.getRegistrations(req, res);
})

router.get('/:slug/registrations/count', (req, res) => {
    eventController.getRegistrationCount(req, res);
})

router.get('/:slug/registration-limit', (req, res) => {
    eventController.getRegistrationLimit(req, res);
})

module.exports = router;