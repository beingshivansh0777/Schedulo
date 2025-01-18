// Event Schema and Model
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    mode: { type: String, enum: ["offline", "online"], required: true },
    link: { type: String }, // Optional, only if mode is 'online'
    eventDate: { type: Date, required: true },
    timeSlots: [
      {
        from: { type: String, required: true }, // Time in HH:MM format
        to: { type: String, required: true },
      },
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
  });
  
  const Event = mongoose.model("Event", eventSchema);
  