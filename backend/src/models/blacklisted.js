import mongoose from "mongoose";

const blacklistedTokens = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, default: Date.now, index: { expires: '1h' } }
});

const blacklistedModel = mongoose.model("Blacklisted", blacklistedTokens)
export default blacklistedModel;
