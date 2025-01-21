const userModel = require('../models/user.model');

module.exports.createUser = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        throw new Error('Missing required fields');
    }
    try {
        const user = new userModel({ name, email, password });
        await user.save();
        return user;
    } catch (err) {
        throw new Error(err.message);
    }
}