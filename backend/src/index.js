// Backend Server - src/server/index.ts
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import shortid from 'shortid';

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/Schedulo";
const JWT_SECRET = "your_secret_key";

// Middleware
app.use(express.json());
app.use(cors());

// Mongoose connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Utility function to handle async errors
/**
 * @param {function(import('express').Request, import('express').Response, import('express').NextFunction): Promise<void>} fn
 * @returns {import('express').RequestHandler}
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Routes
// Sign Up
app.post(
  "/api/signup",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  })
);

// Login
app.post(
  "/api/login",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  })
);

// Event Schema and Model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  mode: { type: String, required: true },
  link: { type: String },
  eventDate: { type: Date, required: true }, // Ensure this is Date type and required
  timeSlots: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
  ],
  slug: { type: String, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Event = mongoose.model("Event", eventSchema);


// Create Event Route
app.post(
  "/api/events",
  asyncHandler(async (req, res) => {
    const { title, description, mode, link, eventDate, timeSlots } = req.body;

    // Check if eventDate is valid
    if (!eventDate || isNaN(new Date(eventDate))) {
      return res.status(400).json({ message: "Invalid event date" });
    }

    const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const slug = shortid.generate();

      const newEvent = new Event({
        title,
        description,
        mode,
        link,
        eventDate: new Date(eventDate), // Convert to Date object
        timeSlots,
        slug: slug,
        createdBy: userId,
      });

      await newEvent.save();

      res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

app.get('/api/events/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const event = await Event.findOne({ slug });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
