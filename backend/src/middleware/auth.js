import jwt from 'jsonwebtoken';
import blacklistedTokens from '../models/blacklisted.js';


const checkBlacklistedToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const blacklisted = await blacklistedTokens.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
export default checkBlacklistedToken;