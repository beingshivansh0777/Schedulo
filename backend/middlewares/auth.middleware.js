const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const userModel = require('../models/user.model');
const redis = require('../db/redis');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }


    const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
    if (isBlacklisted) {
        res.status(401).json({ message: 'Unauthorized, Token expired.' });
        return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const redisUser = await redis.get(`user:${decoded._id}`);

    try {

        if (redisUser) {
            req.user = JSON.parse(redisUser);
            return next();
        } else {
            const user = await userModel.findById(decoded._id);
            req.user = user;
            await redis.set(`user:${decoded._id}`, user, 'EX', 60 * 10); // This will help when user continues to make requests after 60 minutes of inactivity
            return next();
        }

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}