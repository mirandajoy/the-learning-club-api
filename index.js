import cors from 'cors';
import express from 'express';

import usersRouter from './routes/users.js';
import profilesRouter from './routes/profiles.js';
import groupsRouter from './routes/groups.js';
import eventsRouter from './routes/events.js';
import locationsRouter from './routes/locations.js';

import 'dotenv/config';

const app = express();
const { PORT } = process.env;
const port = PORT || 8080

app.use(cors());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/groups', groupsRouter);
app.use('/events', eventsRouter);
app.use('/locations', locationsRouter);

app.get("/test", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`This app is listening on port ${port}`);
});