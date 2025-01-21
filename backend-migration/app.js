const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/events.routes');
const registrationRoutes = require('./routes/registration.routes');
const cookieParser = require('cookie-parser');

const app = express();

connectToDb();
dotenv.config();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Cron job endpoint hit successfully' });
});

app.use('/api', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

module.exports = app;