const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/:registrationId/approve', authMiddleware.authUser, (req, res) => {
    registrationController.approveRegistration(req, res);
});

module.exports = router;