import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import shortid from 'shortid';
import dotenv from "dotenv";
import checkBlacklistedToken from './middleware/auth.js'; // Use import instead of require
import BlacklistedModel from './models/blacklisted.js'

const app = express();
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

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

const User = mongoose.model("User", userSchema); s

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


// Logout


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


// app.use(checkBlacklistedToken);


app.get(
  "/api/logout",
  asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      jwt.verify(token, JWT_SECRET);
      const blacklisted = new BlacklistedModel({ token });
      blacklisted.save()
      res.clearCookie('authToken');
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

// Event Schema and Model
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  mode: { type: String, required: true },
  link: { type: String },
  eventDate: { type: Date, required: true },
  registrationLimit: { type: Number },
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
    const { title, description, mode, link, eventDate, registrationLimit, timeSlots } = req.body;

    if (!eventDate || isNaN(new Date(eventDate))) {
      return res.status(400).json({ message: "Invalid event date" });
    }

    const token = req.headers.authorization?.split(" ")[1];

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
        eventDate: new Date(eventDate),
        registrationLimit,
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

// new route to fetch event by ID
app.get('/api/events/id/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const event = await Event.findOne({
      _id: eventId,
      createdBy: userId
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


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

// OPEN -->

// Get Events Route
app.get(
  "/api/events",
  asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const events = await Event.find({ createdBy: userId });
      res.status(200).json({ events });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  selectedTimeSlot: {
    from: { type: String, required: true },
    to: { type: String, required: true }
  },
  registeredAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
});

const Registration = mongoose.model("Registration", registrationSchema);

app.post("/api/registrations/:registrationId/approve", asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const registration = await Registration.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const event = await Event.findOne({
      _id: registration.eventId,
      createdBy: userId
    });

    if (!event) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    registration.approved = true;
    await registration.save();

    res.status(200).json({
      message: "Registration approved",
      registration: registration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));


app.post("/api/events/:slug/register", asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { name, email, selectedTimeSlot } = req.body;

  const event = await Event.findOne({ slug });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Check if the time slot exists in the event
  const isValidTimeSlot = event.timeSlots.some(
    slot => slot.from === selectedTimeSlot.from && slot.to === selectedTimeSlot.to
  );

  if (!isValidTimeSlot) {
    return res.status(400).json({ message: "Invalid time slot selected" });
  }

  const registration = new Registration({
    eventId: event._id,
    name,
    email,
    selectedTimeSlot
  });

  await registration.save();
  res.status(201).json({ message: "Registration successful" });
}));


// Get registrations for an event
app.get("/api/events/:eventId/registrations", asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // First verify that the event belongs to this user
    const event = await Event.findOne({ _id: req.params.eventId, createdBy: userId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = await Registration.find({ eventId: req.params.eventId })
      .sort({ registeredAt: -1 });

    res.status(200).json({ registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));

// Get total number of registered users for an event by slug
app.get("/api/events/:slug/registrations/count", asyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    const event = await Event.findOne({ slug });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrationCount = await Registration.countDocuments({ eventId: event._id });

    res.status(200).json({ count: registrationCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));

// Get registration limit for an event by slug
app.get("/api/events/:slug/registration-limit", asyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    const event = await Event.findOne({ slug });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ registrationLimit: event.registrationLimit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
