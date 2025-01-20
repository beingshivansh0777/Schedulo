const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const BlacklistTokenModel = require('../models/blacklistToken.model');


module.exports.userSignup = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashedPassword = await existingUser.hashPassword(password);
        const user = await userService.createUser({ name, email, password: hashedPassword });
        return res.status(201).json({ message: 'User created successfully', _id: user._id });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.userLogin = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');;
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = user.generateAuthToken();
        res.cookie('authToken', token);
        return res.status(200).json({ message: 'Login successful', token });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.userLogout = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    try {
        const blackToken = new BlacklistTokenModel({ token: token });
        blackToken.save();
        res.clearCookie('authToken');
        return res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}