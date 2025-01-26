const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const userModel = require('../models/user.model');
const redis = require('../db/redis');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Try Redis first, fallback to database
    let isBlacklisted = await redis.get(`blacklist:${token}`);
    if (!redis.isConnected) {
        // Fallback to database if Redis is not available
        const blacklistedToken = await blacklistTokenModel.findOne({ token: token });
        isBlacklisted = !!blacklistedToken;
    }

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (redis.isConnected) {
            const redisUser = await redis.get(`user:${decoded._id}`);
            if (redisUser) {
                req.user = JSON.parse(redisUser);
                return next();
            }
        }

        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        if (redis.isConnected) {
            await redis.set(`user:${decoded._id}`, JSON.stringify(user), 'EX', 60 * 10);
        }
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}