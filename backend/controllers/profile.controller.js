const userModel = require('../models/user.model');
const redis = require('../db/redis');
const { upload_on_cloudinary } = require('../utils/cloudinary.utils');

module.exports.getProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is attached to req.user from authentication middleware

        // Check if user data exists in Redis cache
        const userKey = `user:${userId}`;
        const cachedUser = await redis.get(userKey);

        if (cachedUser) {
            console.log("Cache hit: Returning user profile from Redis");
            return res.status(200).json({ success: true, data: JSON.parse(cachedUser) });
        }

        // Fetch user from database if not cached
        const user = await userModel.findById(userId).select('-password').populate('createdEvents');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Store user data in Redis cache for future requests (expires in 10 minutes)
        await redis.set(userKey, JSON.stringify(user.toObject()), 'EX', 60 * 10);

        return res.status(200).json({ success: true, data: user });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Server error while fetching profile." });
    }
};

// Edit Profile Controller
module.exports.editProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from authentication middleware
        const updateData = req.body; // Get updated fields from request body

        // Ensure request body has fields to update
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }

        // Update user data
        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
            select: '-password' // Exclude password from response
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the cached user profile in Redis
        const userKey = `user:${userId}`;
        await redis.set(userKey, JSON.stringify(updatedUser.toObject()), 'EX', 60 * 10);

        return res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Server error while updating profile." });
    }
};

// Delete Profile Controller
module.exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from authentication middleware

        // Check if user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user from database
        await userModel.findByIdAndDelete(userId);

        // Remove user data from Redis cache
        const userKey = `user:${userId}`;
        await redis.del(userKey);

        return res.status(200).json({ success: true, message: "User profile deleted successfully" });

    } catch (error) {
        console.error("Error deleting profile:", error);
        return res.status(500).json({ message: "Server error while deleting profile." });
    }
};

module.exports.addImage = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from authentication middleware

        // Check if user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const filebuffer = req.file ? req.file.buffer : null; // Assuming file is available in req.file.buffer

        if (!filebuffer) {
            return res.status(400).send({ error: "No file received" })
        }

        const uploaded_url = await upload_on_cloudinary(filebuffer)

        user.image = uploaded_url

        await user.save()

        return res.status(200).send({ message: "Image updated succesfully", updaterUser: user })
    } catch (error) {
        console.error("Error during profile update:", error);
        res.status(500).json({ error: "An error occurred while updating the profile." });

    }
}